import React from 'react';

function Result(props) {
    return (
        <div className="result-child">
            <div className="circleResult" style={{ color: props.color }} />
            <div className="resultCount" >{props.count}</div>
        </div>
    );
}
export default Result;