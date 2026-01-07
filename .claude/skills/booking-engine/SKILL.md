---
name: booking-engine
description: Expert booking logic and slot generation. Use when implementing reservation availability, time slot calculations, or booking rules.
---

This skill guides booking logic for Pasio Padel Club. Read `.claude/plan.md` for complete business rules.

## Time Grids (Independent by Duration)

**90 min courts** (Double A, B, C, D):
`08:00, 09:30, 11:00, 12:30, 14:00, 15:30, 17:00, 18:30, 20:00`

**60 min courts** (Simple, Kids):
`08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00`

## Slot States

- `available`: Green, bookable
- `booked`: Red, already reserved
- `blocked`: Gray hatched, admin blocked
- `past`: Gray, slot in the past (today only)

## Availability Algorithm

1. Get active courts (apply type/location filters)
2. Generate slots based on court duration
3. Check against existing bookings
4. Check against admin blocked slots
5. Mark past slots for current day

## Business Rules

- Max 2 active bookings per user → Show alert banner when limit reached
- 10 days advance booking max
- 24h cancellation deadline
- Kids court: Open to all (show tooltip)

## Overlap Detection

```
isOverlapping = slot.start < blocked.end AND slot.end > blocked.start
```

## UX

- Mobile: Filters in drawer
- Past slots: Displayed grayed out
- Limit reached: Full display + permanent alert banner
