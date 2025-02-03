'use client'
type Props = {
    amount: number | null;
    reservePrice: number;
};

const baseStyle = {
    border: '2px solid white',
    color: 'white',
    padding: '0.5rem 1rem', 
    borderRadius: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center' as const,
    fontSize: '1rem',
};

const CurrentBid=({ amount, reservePrice }: Props)=> {
    const text = amount !== null ? `${amount.toLocaleString('vi-VN')}` : 'Chưa thầu';
    const colorStyle = amount !== null
        ? amount > reservePrice
            ? { backgroundColor: '#5F9EA0' } 
            : { backgroundColor: '#d97706' } 
        : { backgroundColor: '#dc2626' };    

    return (
        <div style={{ ...baseStyle, ...colorStyle }}>
            {text}
        </div>
    );
}
export default CurrentBid