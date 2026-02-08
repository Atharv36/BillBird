package com.app.invoiceapp.InvoiceApp.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    /**
     * Maximum number of requests allowed within the time window
     */
    int requests() default 5;

    /**
     * Time window in seconds
     */
    int timeWindow() default 60;

    /**
     * Key to identify the rate limit bucket (can include placeholders like {ip}, {user})
     */
    String key() default "{ip}";
}