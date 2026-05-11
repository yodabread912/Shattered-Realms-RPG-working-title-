import random
from dataclasses import dataclass


@dataclass
class GameState:
    player_hp: int = 20
    enemy_hp: int = 15
    potions: int = 2


def player_attack(state: GameState, rng: random.Random) -> int:
    damage = rng.randint(3, 7)
    state.enemy_hp = max(0, state.enemy_hp - damage)
    return damage


def enemy_attack(state: GameState, rng: random.Random) -> int:
    damage = rng.randint(2, 6)
    state.player_hp = max(0, state.player_hp - damage)
    return damage


def use_potion(state: GameState) -> bool:
    if state.potions <= 0:
        return False
    state.potions -= 1
    state.player_hp = min(20, state.player_hp + 6)
    return True


def winner(state: GameState) -> str | None:
    if state.enemy_hp <= 0:
        return "player"
    if state.player_hp <= 0:
        return "enemy"
    return None


def run_game() -> None:
    rng = random.Random()
    state = GameState()

    print("=== Shattered Realms: Simple Text RPG ===")
    print("Defeat the Shadow Beast!")

    while True:
        print(f"\nYour HP: {state.player_hp} | Enemy HP: {state.enemy_hp} | Potions: {state.potions}")
        action = input("Choose action: [A]ttack, [H]eal, [Q]uit: ").strip().lower()

        if action == "q":
            print("You retreat from battle.")
            return
        if action == "a":
            damage = player_attack(state, rng)
            print(f"You strike for {damage} damage!")
        elif action == "h":
            if use_potion(state):
                print("You drink a potion and recover 6 HP.")
            else:
                print("No potions left!")
        else:
            print("Invalid action.")
            continue

        result = winner(state)
        if result == "player":
            print("Victory! The Shadow Beast falls.")
            return

        damage = enemy_attack(state, rng)
        print(f"The Shadow Beast hits you for {damage} damage!")

        result = winner(state)
        if result == "enemy":
            print("Defeat... you have fallen.")
            return


if __name__ == "__main__":
    run_game()
