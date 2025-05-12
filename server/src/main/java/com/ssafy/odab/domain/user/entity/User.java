package com.ssafy.odab.domain.user.entity;

import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "kakao_id", unique = true, nullable = false)
    private Long kakaoId;

    @Column(name = "profile_url", nullable = true)
    private String profileUrl;

    @Column(name = "user_name", nullable = true)
    private String userName;

    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @Column(name = "grade", nullable = true)
    private Integer grade;

    @Column(name = "status", nullable = true)
    private Boolean status;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<LastLearningTime> lastLearningTimes = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<QuestionResult> questionResults = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    public void updateKakaoId(Long kakaoId) {
        this.kakaoId = kakaoId;
    }

    public void updateUserName(String userName) {
        this.userName = userName;
    }

    public void updateProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public void updateCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void updateGrade(Integer grade) {
        this.grade = grade;
    }

    public void updateStatus(Boolean status) {
        this.status = status;
    }

}