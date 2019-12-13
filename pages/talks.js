import React from 'react';

import useDataApi from '../lib/useDataApi';
import Layout from '../components/Layout';
import Talk from '../components/Talk';
import { CardWithLoading } from '../components/Card';
import Grid from '../components/Grid';

const LoadingCalendar = () =>
    [...Array(6).keys()]
        .map((_, index) => <CardWithLoading key={`CardWithLoading${index}`} />)
        .concat(
            [...Array(6).keys()].map((_, index) => (
                <CardWithLoading key={`CardWithLoadingConcat${index}`} />
            )),
        );

const NotPlanned = () => {
    const {
        data: { notPlanned },
        isError,
    } = useDataApi('/api/notPlanned', { notPlanned: null });

    if (isError) return <CardWithLoading />;
    if (!notPlanned) return <CardWithLoading />;

    return notPlanned.map((talk, index) => <Talk key={`notplanned-${index}`} talk={talk} />);
};

const Calendar = () => {
    const {
        data: { calendar },
        isError,
    } = useDataApi('/api/calendar', { calendar: null });

    if (isError) return <LoadingCalendar />;
    if (!calendar) return <LoadingCalendar />;

    return calendar.map((talk, index) => <Talk key={index} talk={talk} />);
};

const Talks = () => (
    <Layout>
        <h2>Calendar</h2>
        <Grid>
            <Calendar />
        </Grid>
        <h2>Not planned</h2>
        <Grid>
            <NotPlanned />
        </Grid>
    </Layout>
);

export default Talks;
