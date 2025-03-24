import React from  'react';
import { Link } from 'react-router-dom';

export default () => {
    return (<div>
         Я другая страница
         <Link to="/">Домой обратно</Link>
    </div>);
};