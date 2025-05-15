package com.ssafy.odab.common.repository;

import java.util.List;
import java.util.concurrent.TimeUnit;

public interface RedisRepository {

    <T> void saveInSet(String key, T value);

    <T> void saveInList(String key, T value);

    <T> List<T> getList(String key, Class<T> elementType);

    void setExpire(String key, long timeout, TimeUnit timeUnit);

    boolean containsKey(String key);

    <T> boolean containsKeyInSet(String key, T value);

    boolean delete(String key);

}
