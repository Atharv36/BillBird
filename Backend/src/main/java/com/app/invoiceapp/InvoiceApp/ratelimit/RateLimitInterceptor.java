package com.app.invoiceapp.InvoiceApp.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Method;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    @Autowired
    private RateLimitService rateLimitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        Method method = handlerMethod.getMethod();
        RateLimit rateLimit = method.getAnnotation(RateLimit.class);

        if (rateLimit == null) {
            return true;
        }

        String key = buildKey(rateLimit.key(), request);

        boolean allowed = rateLimitService.isAllowed(key, rateLimit.requests(), rateLimit.timeWindow());

        if (!allowed) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
            return false;
        }

        return true;
    }

    private String buildKey(String keyTemplate, HttpServletRequest request) {
        String key = keyTemplate;

        if (key.contains("{ip}")) {
            String clientIp = getClientIpAddress(request);
            key = key.replace("{ip}", clientIp);
        }

        if (key.contains("{user}")) {
            // For authenticated requests, you could get user from SecurityContext
            // For now, we'll use IP as fallback
            String clientIp = getClientIpAddress(request);
            key = key.replace("{user}", clientIp);
        }

        return key;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}