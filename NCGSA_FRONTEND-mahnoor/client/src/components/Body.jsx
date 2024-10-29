import React from 'react'
import ChartGrid from './ChartGrid'
import Record from './Record'

const Body = ({data}) => {
    
    return (
        <div className='w-full mx-3 '>
            <ChartGrid data={data} />
            <Record />
        </div>
    )
}

export default Body