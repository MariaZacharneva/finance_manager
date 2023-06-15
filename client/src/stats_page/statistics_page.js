import {GetAllSpendings} from "../utils/spendings_service";
import {useEffect} from "react";

function StatisticsPage({changeTab}) {
    useEffect(() => {
        changeTab('statistics');
    }, [changeTab]);

    const [spendings, setSpendings] = GetAllSpendings();
    const totalSpendings = spendings.length;
    const totalSum = spendings.reduce((acc, cur) => acc + parseInt(cur.value), 0);

    return (
        <div>
            <h2>Statistics</h2>
            <p>Total spendings: {totalSpendings}</p>
            <p>Total sum: {totalSum}</p>
        </div>
    );
}

export default StatisticsPage;
