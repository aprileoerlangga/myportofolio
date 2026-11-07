total_cards = 5
start_fly = 0.40
end_fly = 0.88
card_duration = (end_fly - start_fly) / (total_cards - 1)

print(f"Card duration: {card_duration:.3f}")

for idx in range(total_cards - 1):
    c_start = start_fly + idx * card_duration
    c_end = c_start + card_duration
    rot = -6 if idx % 2 == 0 else 6
    print(f"Card {idx}: flies up from scroll {c_start:.3f} to {c_end:.3f} with rotate {rot:+d}deg")

