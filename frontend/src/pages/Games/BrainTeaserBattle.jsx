import MCQGameEngine from '../../components/MCQGameEngine/MCQGameEngine';
import { brainTeaserQuestions } from '../../data/brainTeaserQuestions';

export default function BrainTeaserBattle() {
  return (
    <MCQGameEngine
      gameSlug="brain-teaser-battle"
      gameTitle="Brain Teaser Battle"
      gameIcon="⚡"
      category="Brain Training"
      questionBank={brainTeaserQuestions}
    />
  );
}
