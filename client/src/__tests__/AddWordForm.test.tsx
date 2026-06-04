import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AddWordForm from '../components/forms/AddWordForm';

test('render form', () => {
  render(<AddWordForm />);
  // Query the submit button by role+name to avoid matching the heading text
  expect(screen.getByRole('button', { name: /Add Word/i })).toBeInTheDocument();
});