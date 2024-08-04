import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Login/Login.css"
// import axiosInstance from '../../axiosInstance';
import { usePorts } from '../../contexts/PortContext';


const SelectOption: React.FC = () => {
    const { ports, selectedPort, setSelectedPort } = usePorts();

    const [option, setOption] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!option) {
            setErrors(true);
        }else {
            localStorage.setItem("selectedport", option)
            setSelectedPort(parseInt(option));
            setErrors(false);
            navigate('/contracts');
        }
    };

    useEffect(() => {
        // Assume the first port is the default selected port if none is selected
        // if (ports.length > 0 && selectedPort === null) {
        //   setSelectedPort(ports[0].id);
        //   setOption(''+ports[0].id)
        // }
      }, [ports, selectedPort, setSelectedPort]);

    return (
        <div className='login-container'>
            <img src='../../../logo.png' alt="imagelogo" className='logo-img' />
            <div className='login-form'>
                <h1>Select a port</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        {/* <label>Options: </label> */}
                        <select onChange={(e) => setOption(e.target.value)} required>
                            <option value="" >Select one</option>
                            {ports && ports.map(port => 
                                <option key={port.id} value={port.id}>{port.portName}</option>
                            )}
                        </select>
                        {errors && <div style={{ color: 'red' }}>Please select one port</div>}
                    </div>
                    <button type="submit">Continue</button>
                </form>
            </div>
        </div>
    );
};

export default SelectOption;
