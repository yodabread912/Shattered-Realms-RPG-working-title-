import random
import unittest

from text_rpg import GameState, enemy_attack, player_attack, use_potion, winner


class TestTextRpg(unittest.TestCase):
    def test_player_attack_reduces_enemy_hp(self):
        state = GameState(enemy_hp=10)
        rng = random.Random(1)
        damage = player_attack(state, rng)

        self.assertEqual(damage, 4)
        self.assertEqual(state.enemy_hp, 10 - damage)

    def test_enemy_attack_reduces_player_hp(self):
        state = GameState(player_hp=10)
        rng = random.Random(2)
        damage = enemy_attack(state, rng)

        self.assertEqual(damage, 2)
        self.assertEqual(state.player_hp, 10 - damage)

    def test_use_potion_heals_and_spends(self):
        state = GameState(player_hp=10, potions=1)

        used = use_potion(state)

        self.assertTrue(used)
        self.assertEqual(state.player_hp, 16)
        self.assertEqual(state.potions, 0)

    def test_use_potion_fails_when_empty(self):
        state = GameState(player_hp=10, potions=0)

        used = use_potion(state)

        self.assertFalse(used)
        self.assertEqual(state.player_hp, 10)
        self.assertEqual(state.potions, 0)

    def test_use_potion_caps_at_max_hp(self):
        state = GameState(player_hp=18, potions=1)

        used = use_potion(state)

        self.assertTrue(used)
        self.assertEqual(state.player_hp, 20)
        self.assertEqual(state.potions, 0)

    def test_winner_player(self):
        state = GameState(enemy_hp=0)
        self.assertEqual(winner(state), "player")

    def test_winner_enemy(self):
        state = GameState(player_hp=0)
        self.assertEqual(winner(state), "enemy")

    def test_winner_none_when_battle_active(self):
        state = GameState(player_hp=5, enemy_hp=5)
        self.assertIsNone(winner(state))


if __name__ == "__main__":
    unittest.main()
