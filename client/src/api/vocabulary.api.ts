export const addWordAPI = async (word: string, meaning: string) => {
    const res = await fetch('http://localhost:3000/api/word', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word, meaning })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Error');
    }

    return res.json();
};