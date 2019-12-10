import { useState } from 'react';
import fetch from '../frontside/fetch';
import Layout from '../components/layout';
import Talk from '../components/talk';
import Card from '../components/card';
import LoadingCard from '../components/loadingCard';
import Grid from '../components/grid';
import months from '../utilities/months';

const Talks = () => {
    const [calendar, setCalendar] = useState('loading');
    const [noDate, setNoDate] = useState('loading');

    if (calendar === 'loading' && noDate === 'loading') {
        const talks = fetch('/talks').catch(error => console.error(error) || []);

        talks
            .then(talks => talks.filter(talk => new Date(talk.date) > new Date()))
            .then(talks =>
                talks.reduce(
                    (calendar, talk) => {
                        const talkMonth = new Date(talk.date).getMonth();
                        const currentMonth = new Date().getMonth();
                        const index =
                            talkMonth >= currentMonth
                                ? talkMonth - currentMonth
                                : 12 - currentMonth + talkMonth;
                        calendar[index] = talk;
                        return calendar;
                    },
                    [null, null, null, null, null, null, null, null, null, null, null, null],
                ),
            )
            .then(talks => setCalendar(talks));

        talks.then(talks => setNoDate(talks.filter(talk => !talk.date)));
    }

    const loadingCalendar = [...Array(6).keys()]
        .map(() => <LoadingCard lines={5} />)
        .concat([...Array(6).keys()].map(() => <LoadingCard lines={3} />));

    return (
        <div>
            <Layout>
                <h2>Calendar</h2>
                <Grid>
                    {calendar === 'loading'
                        ? loadingCalendar
                        : calendar.map((talk, index) =>
                              talk ? (
                                  <Talk key={index} talk={talk} />
                              ) : (
                                  <Card
                                      key={index}
                                      title={months[(index + new Date().getMonth()) % 12]}
                                      state="pending"
                                  >
                                      Pending
                                  </Card>
                              ),
                          )}
                </Grid>
                <h2>Not planned</h2>
                <Grid>
                    {noDate === 'loading' ? (
                        <LoadingCard />
                    ) : (
                        noDate.map((talk, index) => <Talk key={index} talk={talk} />)
                    )}
                </Grid>
            </Layout>
        </div>
    );
};

export default Talks;
