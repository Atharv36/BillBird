package com.app.invoiceapp.InvoiceApp.ratelimit;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class RateLimitService {

    private final ConcurrentHashMap<String, RateLimitBucket> buckets = new ConcurrentHashMap<>();

    public boolean isAllowed(String key, int maxRequests, int timeWindowSeconds) {
        RateLimitBucket bucket = buckets.computeIfAbsent(key, k -> new RateLimitBucket(maxRequests, timeWindowSeconds));

        synchronized (bucket) {
            long currentTime = System.currentTimeMillis();
            long windowStart = bucket.getWindowStart();

            // Check if we need to reset the window
            if (currentTime - windowStart >= bucket.getTimeWindowSeconds() * 1000L) {
                bucket.reset(currentTime);
            }

            // Check if limit exceeded
            if (bucket.getRequestCount() >= bucket.getMaxRequests()) {
                return false;
            }

            // Increment request count
            bucket.increment();
            return true;
        }
    }

    public void cleanupExpiredBuckets() {
        long currentTime = System.currentTimeMillis();
        buckets.entrySet().removeIf(entry -> {
            RateLimitBucket bucket = entry.getValue();
            return (currentTime - bucket.getWindowStart()) >= bucket.getTimeWindowSeconds() * 1000L * 2; // Keep for 2x window time
        });
    }

    private static class RateLimitBucket {
        private final int maxRequests;
        private final int timeWindowSeconds;
        private long windowStart;
        private AtomicLong requestCount;

        public RateLimitBucket(int maxRequests, int timeWindowSeconds) {
            this.maxRequests = maxRequests;
            this.timeWindowSeconds = timeWindowSeconds;
            this.windowStart = System.currentTimeMillis();
            this.requestCount = new AtomicLong(0);
        }

        public void reset(long currentTime) {
            this.windowStart = currentTime;
            this.requestCount.set(0);
        }

        public void increment() {
            this.requestCount.incrementAndGet();
        }

        public long getRequestCount() {
            return requestCount.get();
        }

        public long getWindowStart() {
            return windowStart;
        }

        public int getTimeWindowSeconds() {
            return timeWindowSeconds;
        }

        public int getMaxRequests() {
            return maxRequests;
        }
    }
}