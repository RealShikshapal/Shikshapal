/**
 * Grade 8 Portal — Flashcard & MCQ Engine
 * Pure vanilla JS, no dependencies.
 */
(function () {
  'use strict';

  /* ── Flashcards ── */
  document.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  /* ── MCQ Quiz ── */
  document.querySelectorAll('.mcq-quiz').forEach(quiz => {
    const items = quiz.querySelectorAll('.mcq-item');
    const scoreBar = quiz.querySelector('.mcq-score-bar');
    const scoreText = scoreBar?.querySelector('.score-text');
    const scoreFill = scoreBar?.querySelector('.bar');
    const resetBtn = scoreBar?.querySelector('.mcq-reset-btn');
    let answered = 0;
    let correct = 0;
    const total = items.length;

    function updateScore() {
      if (!scoreText) return;
      scoreText.textContent = correct + ' / ' + total;
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
      if (scoreFill) scoreFill.style.width = pct + '%';
    }

    items.forEach(item => {
      const options = item.querySelectorAll('.mcq-option');
      const fb = item.querySelector('.mcq-feedback');
      const correctAnswer = item.dataset.answer; // e.g. "B"

      options.forEach(opt => {
        opt.addEventListener('click', () => {
          if (item.classList.contains('answered')) return;
          item.classList.add('answered');
          answered++;

          const chosen = opt.dataset.letter;
          // Disable all options
          options.forEach(o => o.classList.add('disabled'));

          // Mark correct option
          options.forEach(o => {
            if (o.dataset.letter === correctAnswer) o.classList.add('correct');
          });

          if (chosen === correctAnswer) {
            opt.classList.add('correct');
            correct++;
            if (fb) {
              fb.classList.add('correct-fb', 'show');
              fb.innerHTML = '✅ ' + fb.dataset.correct;
            }
          } else {
            opt.classList.add('wrong');
            if (fb) {
              fb.classList.add('wrong-fb', 'show');
              fb.innerHTML = '❌ ' + fb.dataset.wrong;
            }
          }
          updateScore();
        });
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        answered = 0;
        correct = 0;
        items.forEach(item => {
          item.classList.remove('answered');
          const options = item.querySelectorAll('.mcq-option');
          options.forEach(o => {
            o.classList.remove('disabled', 'selected', 'correct', 'wrong');
          });
          const fb = item.querySelector('.mcq-feedback');
          if (fb) {
            fb.classList.remove('correct-fb', 'wrong-fb', 'show');
            fb.innerHTML = '';
          }
        });
        updateScore();
      });
    }

    updateScore();
  });
})();
