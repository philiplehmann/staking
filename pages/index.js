import { useState, useCallback, useMemo, memo } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const payoutsPerWeek = (payouts) => {
  const payoutDays = [];
  const count = Math.floor(7 / payouts);
  for (let i = 0; i < payouts; i++) {
    payoutDays.push(i + 1 == payouts ? 7 - i * count : count);
  }
  return payoutDays;
};

const Home = memo(() => {
  const [rate, setRate] = useState("3");
  const [capital, setCapital] = useState("3500");
  const [percent, setPercent] = useState("20");
  const [payouts, setPayouts] = useState("2");
  const [years, setYears] = useState("4");

  const setRateHandler = useCallback(
    (event) => {
      setRate(event.target.value);
    },
    [setRate]
  );
  const setCapitalHandler = useCallback(
    (event) => {
      setCapital(event.target.value);
    },
    [setCapital]
  );
  const setPercentHandler = useCallback(
    (event) => {
      setPercent(event.target.value);
    },
    [setPercent]
  );
  const setPayoutsHandler = useCallback(
    (event) => {
      setPayouts(event.target.value);
    },
    [setPayouts]
  );
  const setYearsHandler = useCallback(
    (event) => {
      setYears(event.target.value);
    },
    [setPayouts]
  );

  const groupedProgression = useMemo(() => {
    const rounds = Math.ceil((365 / 7) * Number(payouts)) * Number(years);
    const progression = [];
    const payoutDays = payoutsPerWeek(Number(payouts));
    let currentCapital = Number(capital);
    let currentDays = 0;
    const now = Date.now();
    for (let i = 0; i < rounds; i++) {
      const days = payoutDays[i % Number(payouts)];
      currentCapital =
        currentCapital +
        (((currentCapital / 100) * Number(percent)) / 365) * days;
      currentDays = currentDays + days;
      progression.push({
        capital: currentCapital,
        days: currentDays,
        date: new Date(now + currentDays * 24 * 3600 * 1000),
      });
    }
    return progression.reduce((grouped, entry) => {
      const year = entry.date.getFullYear();
      if (grouped[year] == undefined) grouped[year] = [];
      grouped[year].push(entry);
      return grouped;
    }, {});
  }, [rate, capital, percent, payouts, years]);

  return (
    <div>
      <Head>
        <title>Staking Progression</title>
        <meta
          name="description"
          content="Calculate Staking Payouts with Progression"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          rate <input name="rate" value={rate} onChange={setRateHandler} />
        </div>
        <div>
          capital{" "}
          <input name="capital" value={capital} onChange={setCapitalHandler} />
        </div>
        <div>
          percent{" "}
          <input name="percent" value={percent} onChange={setPercentHandler} />
        </div>
        <div>
          payouts{" "}
          <input name="payouts" value={payouts} onChange={setPayoutsHandler} />
        </div>
        <div>
          years <input name="years" value={years} onChange={setYearsHandler} />
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {Object.keys(groupedProgression).map((year) => {
            return (
              <table key={year}>
                <thead>
                  <tr>
                    <th colSpan="4">{year}</th>
                  </tr>
                  <tr>
                    <th>date</th>
                    <th>count</th>
                    <th>plus</th>
                    <th>amount</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedProgression[year].map(({ capital, date }, index) => {
                    const last = groupedProgression[year][index - 1] || {};
                    const { capital: lastCapital } = last;
                    const dateStr = date.toISOString().substr(0, 10);
                    return (
                      <tr key={dateStr}>
                        <td>{dateStr}</td>
                        <td>{capital}</td>
                        <td>{lastCapital && capital - lastCapital}</td>
                        <td>{Math.round(capital * rate * 100) / 100}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
});

export default Home;
