import React, { useState } from 'react';
import { addWordAPI } from '../api/vocabulary.api';

export const AddWordForm: React.FC = () => {
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        if (!word.trim() || !meaning.trim()) {
            setStatus('error');
            setMessage('❌ Vui lòng nhập đầy đủ từ và nghĩa');
            return;
        }

        setStatus('loading');
        try {
            await addWordAPI(word.trim(), meaning.trim());
            setStatus('success');
            setMessage('✅ Thêm từ thành công!');
            setWord('');
            setMeaning('');
        } catch {
            setStatus('error');
            setMessage('❌ Có lỗi xảy ra khi thêm từ');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Add a word</h2>

            {message && (
                <div style={{ marginBottom: '10px', color: status === 'error' ? 'red' : 'green' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Enter word..."
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    disabled={status === 'loading'}
                />

                <input
                    type="text"
                    placeholder="Enter meaning..."
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    disabled={status === 'loading'}
                />

                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Adding...' : 'Add Word'}
                </button>
            </form>
        </div>
    );
};

export default AddWordForm;