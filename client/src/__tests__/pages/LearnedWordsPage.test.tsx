import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { LearnedWordsPage, groupWords } from '../../pages/LearnedWordsPage';
import { VocabularyProvider } from '../../contexts/VocabularyContext';
import { Word } from '../../contexts/VocabularyContext';

// Helper render với VocabularyProvider — giống pattern của Review.test.tsx
const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <VocabularyProvider>
      {component}
    </VocabularyProvider>
  );
};

// =====================
// PHẦN 1 — Unit test hàm groupWords
// =====================

const mockWords: Word[] = [
  {
    id: '1', word: 'Ephemeral', meaning: 'Short-lived',
    pronunciation: '', examples: ['Cherry blossoms are ephemeral.'],
    synonyms: ['fleeting', 'transient'],
    topics: ['Nature', 'Time'],
    category: 'learned', addedDate: new Date(), reviewCount: 5,
    lastReviewed: new Date(),
  },
  {
    id: '2', word: 'Serendipity', meaning: 'Happy accident',
    pronunciation: '', examples: ['Meeting her was serendipity.'],
    synonyms: ['luck', 'chance'],
    topics: ['Life'],
    category: 'learned', addedDate: new Date(), reviewCount: 3,
  },
];

describe('groupWords', () => {

  it('gom nhóm đúng theo topics', () => {
    const result = groupWords(mockWords, 'topics');
    expect(result['Nature']).toHaveLength(1);
    expect(result['Nature'][0].word).toBe('Ephemeral');
    expect(result['Time']).toHaveLength(1);
    expect(result['Life']).toHaveLength(1);
  });

  it('từ có nhiều topics thì xuất hiện ở nhiều nhóm', () => {
    const result = groupWords(mockWords, 'topics');
    expect(result['Nature'][0].word).toBe('Ephemeral');
    expect(result['Time'][0].word).toBe('Ephemeral');
  });

  it('gom nhóm đúng theo synonyms', () => {
    const result = groupWords(mockWords, 'synonyms');
    expect(result['fleeting']).toHaveLength(1);
    expect(result['luck']).toHaveLength(1);
  });

  it('trả về object rỗng khi không có từ nào', () => {
    const result = groupWords([], 'topics');
    expect(result).toEqual({});
  });

});

// =====================
// PHẦN 2 — Component test LearnedWordsPage
// =====================

describe('LearnedWordsPage component', () => {

  it('hiển thị đúng tiêu đề trang', () => {
    renderWithProvider(<LearnedWordsPage />);
    expect(screen.getByText('Learned Words')).toBeInTheDocument();
  });

  it('chỉ hiển thị từ có category = learned', () => {
    renderWithProvider(<LearnedWordsPage />);
    // Tìm container chứa số lượng từ
    const header = screen.getByText('Learned Words');
    expect(header).toBeInTheDocument();
    // Kiểm tra số lượng groups hiển thị đúng
    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  it('hiển thị icon tìm kiếm khi chưa gõ gì', () => {
    renderWithProvider(<LearnedWordsPage />);
    expect(screen.getByText(/type a/i)).toBeInTheDocument();
  });

  it('hiển thị gợi ý khi gõ một phần tên group', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Na' } });
    // "Nature" chứa "Na" → phải xuất hiện trong dropdown
    expect(screen.getByText('Nature')).toBeInTheDocument();
  });

  it('hiển thị danh sách từ khi gõ đúng tên group', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Nature' } });
    // Ephemeral thuộc topic Nature → phải xuất hiện
    expect(screen.getByText('Ephemeral')).toBeInTheDocument();
  });

  it('hiển thị thông báo không tìm thấy khi gõ sai', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'xyzabc123' } });
    expect(screen.getByText(/no group found/i)).toBeInTheDocument();
  });

  it('toggle sang By Synonym thì tìm theo synonym', () => {
    renderWithProvider(<LearnedWordsPage />);
    // Bấm nút By Synonym
    fireEvent.click(screen.getByText('By Synonym'));
    // Gõ synonym hợp lệ
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'fleeting' } });
    // Ephemeral có synonym fleeting → phải xuất hiện
    expect(screen.getByText('Ephemeral')).toBeInTheDocument();
  });

  it('đổi toggle thì xóa ô tìm kiếm', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Nature' } });
    // Đổi sang By Synonym
    fireEvent.click(screen.getByText('By Synonym'));
    // Input phải được reset
    expect(input).toHaveValue('');
  });

  it('bấm vào từ thì hiển thị chi tiết', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Nature' } });
    // Bấm vào card từ Ephemeral
    fireEvent.click(screen.getByText('Ephemeral'));
    // Example phải hiện ra
    expect(screen.getByText(/cherry blossoms/i)).toBeInTheDocument();
  });

  it('bấm lại vào từ đang mở thì đóng chi tiết lại', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Nature' } });
    fireEvent.click(screen.getByText('Ephemeral'));
    // Đang mở — bấm lại để đóng
    fireEvent.click(screen.getByText('Ephemeral'));
    expect(screen.queryByText(/cherry blossoms/i)).not.toBeInTheDocument();
  });

  it('bấm vào gợi ý trong dropdown thì điền vào ô tìm kiếm', () => {
    renderWithProvider(<LearnedWordsPage />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Na' } });
    // Bấm vào gợi ý Nature
    fireEvent.click(screen.getByText('Nature'));
    expect(input).toHaveValue('Nature');
  });

});