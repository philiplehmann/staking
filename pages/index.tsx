import React, { useState, useCallback, useMemo, memo, SyntheticEvent, useEffect } from "react";
import Head from "next/head";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import styles from "../styles/Home.module.css";
import { SimpleTable } from "../components/table";
import { FormControl, TextField } from "@mui/material";

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

  const [year, setYear] = useState(String(new Date().getFullYear()));

  const setYearHandler = useCallback((event: SyntheticEvent, newValue: string) => {
    setYear(newValue);
  }, [setYear]);
  const setRateHandler = useCallback(
    (event) => {
      setRate(event.target.value);
      localStorage.setItem("staking-rate", event.target.value);
    },
    [setRate]
  );
  const setCapitalHandler = useCallback(
    (event) => {
      setCapital(event.target.value);
      localStorage.setItem("staking-capital", event.target.value);
    },
    [setCapital]
  );
  const setPercentHandler = useCallback(
    (event) => {
      setPercent(event.target.value);
      localStorage.setItem("staking-percent", event.target.value);
    },
    [setPercent]
  );
  const setPayoutsHandler = useCallback(
    (event) => {
      setPayouts(event.target.value);
      localStorage.setItem("staking-payouts", event.target.value);
    },
    [setPayouts]
  );
  const setYearsHandler = useCallback(
    (event) => {
      setYears(event.target.value);
      localStorage.setItem("staking-years", event.target.value);
    },
    [setPayouts]
  );

  useEffect(() => {
    if(localStorage.getItem("staking-rate")) setRate(localStorage.getItem("staking-rate"))
    if(localStorage.getItem("staking-capital")) setCapital(localStorage.getItem("staking-capital"))
    if(localStorage.getItem("staking-percent")) setPercent(localStorage.getItem("staking-percent"))
    if(localStorage.getItem("staking-payouts")) setPayouts(localStorage.getItem("staking-payouts"))
    if(localStorage.getItem("staking-years")) setYears(localStorage.getItem("staking-years"))
  }, [setRate, setCapital, setPercent, setPayouts, setYears]);

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
      <FormControl>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField label="Rate" value={rate} onChange={setRateHandler} />
          <TextField label="Capital" value={capital} onChange={setCapitalHandler} />
          <TextField label="Percent" value={percent} onChange={setPercentHandler} />
          <TextField label="Payouts" value={payouts} onChange={setPayoutsHandler} />
          <TextField label="Years" value={years} onChange={setYearsHandler} />
        </Box>
      </FormControl>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={year} onChange={setYearHandler}>
              {Object.keys(groupedProgression).map((year) => {
                return <Tab label={year} value={year} key={year} />;
              })}
            </Tabs>
          </Box>
          {<SimpleTable
              rows={(groupedProgression[year] || []).map(
                ({ capital, date }, index) => {
                  const last = groupedProgression[year][index - 1] || {};
                  const { capital: lastCapital } = last;
                  return {
                    id: index,
                    date,
                    count: capital,
                    plus: lastCapital && capital - lastCapital,
                    amount: Math.round(Number(capital) * Number(rate) * 100) / 100,
                  };
                }
              )}
            />}
        </Box>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
});

export default Home;
