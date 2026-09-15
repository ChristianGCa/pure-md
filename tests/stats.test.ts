import { describe, it, expect } from 'vitest';
import { calculateStats } from '../src/utils/stats';

describe('stats utility', () => {
  it('handles empty text', () => {
    const stats = calculateStats('');
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.charactersNoSpaces).toBe(0);
    expect(stats.readingTimeMinutes).toBe(0);
    expect(stats.lines).toBe(1);
  });

  it('counts words and characters accurately', () => {
    const text = 'Olá mundo, testando o editor markdown!';
    const stats = calculateStats(text);
    expect(stats.words).toBe(6);
    expect(stats.characters).toBe(text.length);
    expect(stats.charactersNoSpaces).toBe(text.replace(/\s/g, '').length);
    expect(stats.lines).toBe(1);
  });

  it('handles multiple lines and whitespace', () => {
    const text = "Linha 1\n\nLinha 2 com   múltiplos espaços\nLinha 3";
    const stats = calculateStats(text);
    expect(stats.words).toBe(9);
    expect(stats.lines).toBe(4);
  });

  it('calculates reading time correctly based on 200 wpm', () => {
    // 400 words = 2 minutes
    const words400 = new Array(400).fill('palavra').join(' ');
    const stats = calculateStats(words400);
    expect(stats.words).toBe(400);
    expect(stats.readingTimeMinutes).toBe(2);
  });
});
