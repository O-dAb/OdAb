package com.ssafy.odab.common.repository;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RedisRepositoryImpl implements RedisRepository {

  private final RedisTemplate<String, Object> redisTemplate;

  @Override
  public <T> void saveInSet(String key, T value) {
    redisTemplate.opsForSet().add(key, value);
  }

  @Override
  public <T> void saveInList(String key, T value) {
    redisTemplate.opsForList().leftPush(key, value);
  }


  @Override
  public <T> List<T> getList(String key, Class<T> elementType) {
    List<Object> range = redisTemplate.opsForList().range(key, 0, -1);
    if (range == null) {
      return Collections.emptyList();
    }

    return range.stream().filter(elementType::isInstance).map(elementType::cast)
        .collect(Collectors.toList());
  }

  @Override
  public void setExpire(String key, long timeout, TimeUnit timeUnit) {
    redisTemplate.expire(key, timeout, timeUnit);
  }

  @Override
  public boolean containsKey(String key) {
    return redisTemplate.hasKey(key);
  }

  @Override
  public <T> boolean containsKeyInSet(String key, T value) {
    if (key != null && value != null) {
      return redisTemplate.opsForSet().isMember(key, value);
    }
    return false;
  }

  @Override
  public boolean delete(String key) {
    return redisTemplate.delete(key);
  }

}
