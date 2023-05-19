function SpendingList({spendings}) {
    const sortedSpendings = spendings.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div>
            <h2>Spending List</h2>
            <table style={{borderCollapse: "collapse", width: "50%"}}>
                <thead>
                <tr>
                    <th style={tableHeaderStyle}>Description</th>
                    <th style={tableHeaderStyle}>Value</th>
                    <th style={tableHeaderStyle}>Currency</th>
                    <th style={tableHeaderStyle}>Date</th>
                </tr>
                </thead>
                <tbody>
                {sortedSpendings.map((spending, index) => (
                    <tr key={index}>
                        <td style={tableCellStyle}>{spending.description}</td>
                        <td style={tableCellStyle}>{spending.value}</td>
                        <td style={tableCellStyle}>{spending.currency}</td>
                        <td style={tableCellStyle}>{(new Date(spending.date)).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const tableHeaderStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
    fontWeight: "bold",
};

const tableCellStyle = {
    border: "1px solid black",
    padding: "8px",
};

export default SpendingList;