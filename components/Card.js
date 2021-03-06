import React from 'react';
import PropTypes from 'prop-types';
import { Card as AntCard, Icon, Button } from 'antd';
import { blue, green, orange, red } from '@ant-design/colors';

const stateToIcon = {
    pending: 'question-circle',
    valid: 'check-circle',
    warning: 'exclamation-circle',
    error: 'warning',
};

const stateToColor = {
    pending: blue.primary,
    valid: green.primary,
    warning: orange.primary,
    error: red.primary,
};

const Card = ({ title, state, className, children }) => {
    const extra = state ? (
        <Icon type={stateToIcon[state]} theme="twoTone" twoToneColor={stateToColor[state]} />
    ) : (
        ''
    );

    return (
        <AntCard title={title} className={className} extra={extra}>
            {children}
        </AntCard>
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    state: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

Card.defaultProps = {
    className: null,
    state: null,
};

export default Card;

export const CardWithNetwork = ({ title, state, className, children, requestState }) => {
    if (requestState.isLoading) {
        return <CardWithLoading title={title} state={state} className={className} />;
    }

    if (requestState.isFailure) {
        return (
            <CardWithError
                title={title}
                state={state}
                className={className}
                onFailureRetry={requestState.retry}
            />
        );
    }

    return (
        <Card title={title} state={state} className={className}>
            {children}
        </Card>
    );
};

CardWithNetwork.propTypes = {
    title: PropTypes.string,
    state: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    requestState: PropTypes.shape({
        isLoading: PropTypes.func,
        isFailure: PropTypes.func,
        retry: PropTypes.func,
    }),
};

export const CardWithLoading = ({ title }) => <AntCard title={title} loading={true}></AntCard>;

CardWithLoading.propTypes = {
    title: PropTypes.string,
};

CardWithLoading.defaultProps = {
    title: '',
};

export const CardWithError = ({ title, onFailureRetry }) => (
    <AntCard
        title={title}
        extra={
            title ? <Icon type="close-circle" theme="twoTone" twoToneColor={red.primary} /> : null
        }
        actions={[
            <Button key="antCard-dangerAction" type="danger" onClick={onFailureRetry}>
                Try Again
            </Button>,
        ]}
    >
        <AntCard.Meta title="ERROR !" description="Oh no, someting went wrong" />
    </AntCard>
);

CardWithError.propTypes = {
    title: PropTypes.string,
    onFailureRetry: PropTypes.func,
};

CardWithError.defaultProps = {
    title: '',
    onFailureRetry: () => {},
};
