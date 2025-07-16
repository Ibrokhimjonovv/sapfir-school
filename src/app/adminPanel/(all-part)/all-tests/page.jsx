import TestsList from '@/components/adminPanel/all-tests/all-tests'
import React from 'react';
import "./page.scss";

const AllTests = () => {
  return (
    <div className='all-tests-container'>
        <h2>Fanlarga tegishli barcha testlar</h2>
        <TestsList />
    </div>
  )
}

export default AllTests