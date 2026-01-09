package com.koushik.expansetracker.controller.finance;

import com.koushik.expansetracker.dto.SavingsGoalRequest;
import com.koushik.expansetracker.dto.SavingsGoalResponse;
import com.koushik.expansetracker.entity.finance.SavingsGoal;
import com.koushik.expansetracker.mapper.FinanceMapper;
import com.koushik.expansetracker.security.CustomUserDetails;
import com.koushik.expansetracker.service.finance.interfaces.SavingsGoalServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class SavingsGoalController {

    private final SavingsGoalServiceInterface goalService;
    private final FinanceMapper mapper;

    @PostMapping
    public ResponseEntity<SavingsGoalResponse> createGoal(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody SavingsGoalRequest request
    ) {
        SavingsGoal goal = mapper.toSavingsGoalEntity(
                request,
                user.getUser().getUserId()
        );
        return ResponseEntity.ok(
                mapper.toSavingsGoalResponse(goalService.createGoal(goal))
        );
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoalResponse>> getGoals(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(
                goalService.getGoalsForUser(user.getUser().getUserId())
                        .stream()
                        .map(mapper::toSavingsGoalResponse)
                        .toList()
        );
    }

    /* ✅ FIXED TRANSFER ENDPOINT */
    @PostMapping("/{goalId}/transfer")
    public ResponseEntity<SavingsGoalResponse> transferToGoal(
            @PathVariable Long goalId,
            @RequestParam Long accountId,
            @RequestParam BigDecimal amount
    ) {
        return ResponseEntity.ok(
                mapper.toSavingsGoalResponse(
                        goalService.transferFromAccount(goalId, accountId, amount)
                )
        );
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long goalId) {
        goalService.deleteGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}
