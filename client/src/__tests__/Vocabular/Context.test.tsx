import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { VocabularyProvider, useVocabulary } from '../../contexts/VocabularyContext';

// Thành phần bổ trợ để truy cập và kiểm tra các giá trị từ Context
const TestComponent = () => {
  const { 
    words, 
    addWord, 
    updateWord, 
    deleteWord, 
    totalLearned, 
    reviewDue 
  } = useVocabulary();

  return (
    <div>
      <div data-testid="total-learned">{totalLearned}</div>
      <div data-testid="review-due">{reviewDue}</div>
      <div data-testid="word-count">{words.length}</div>
      <ul>
        {words.map((w) => (
          <li key={w.id}>
            {w.word} - {w.category}
            <button onClick={() => deleteWord(w.id)}>Delete {w.id}</button>
            <button onClick={() => updateWord(w.id, { word: 'Updated' })}>Update {w.id}</button>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addWord({
            id: '999',
            word: 'NewWord',
            meaning: 'New Meaning',
            pronunciation: '',
            examples: [],
            synonyms: [],
            topics: [],
            category: 'learned',
            addedDate: new Date(),
            reviewCount: 0,
          })
        }
      >
        Add Word
      </button>
    </div>
  );
};

describe('VocabularyContext', () => {
  const renderProvider = () =>
    render(
      <VocabularyProvider>
        <TestComponent />
      </VocabularyProvider>
    );

  it('nên hiển thị dữ liệu mẫu ban đầu', () => {
    renderProvider();
    // Dựa trên dữ liệu sampleWords trong file của bạn (8 từ)
    expect(screen.getByTestId('word-count').textContent).toBe('8');
    expect(screen.getByText(/Ephemeral/i)).toBeInTheDocument();
  });

  it('nên thêm từ mới vào danh sách', () => {
    renderProvider();
    const addButton = screen.getByText('Add Word');

    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId('word-count').textContent).toBe('9');
    expect(screen.getByText(/NewWord/i)).toBeInTheDocument();
  });

  it('nên cập nhật thông tin từ vựng', () => {
    renderProvider();
    // Từ id "1" ban đầu là "Ephemeral"
    const updateButton = screen.getByText('Update 1');

    act(() => {
      updateButton.click();
    });

    expect(screen.getByText(/Updated/i)).toBeInTheDocument();
    expect(screen.queryByText('Ephemeral')).not.toBeInTheDocument();
  });

  it('nên xóa từ vựng khỏi danh sách', () => {
    renderProvider();
    const deleteButton = screen.getByText('Delete 1');

    act(() => {
      deleteButton.click();
    });

    expect(screen.getByTestId('word-count').textContent).toBe('7');
    expect(screen.queryByText('Ephemeral')).not.toBeInTheDocument();
  });

  it('nên tính toán đúng tổng số từ đã học', () => {
    renderProvider();
    // Trong sampleWords có 4 từ category "learned" (id: 1, 2, 7, 8)
    expect(screen.getByTestId('total-learned').textContent).toBe('4');
  });

  it('nên báo lỗi nếu useVocabulary được dùng ngoài Provider', () => {
    // Tắt console.error tạm thời để tránh làm bẩn log khi test lỗi cố ý
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow(
      'useVocabulary must be used within VocabularyProvider'
    );

    consoleSpy.mockRestore();
  });
});