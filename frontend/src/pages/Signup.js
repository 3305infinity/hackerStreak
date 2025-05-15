// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaLock, FaCheck, FaArrowRight } from 'react-icons/fa';
// import './Signup.css';

// const Signup = () => {
//     const [step, setStep] = useState(1);
//     const [otp, setOtp] = useState('');
//     const [serverOtp, setServerOtp] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const [user, setUser] = useState({ 
//         name: '', 
//         email: '', 
//         password: '', 
//         cpassword: '' 
//     });
//     const onChange = (e) => {
//         setUser({ ...user, [e.target.name]: e.target.value });
//         setError('');
//     };

//     const sendOtp = async () => {
//         if (!user.name || !user.email) {
//             setError('Please fill all fields');
//             return;
//         }
    
//         setIsLoading(true);
//         setError(''); // Clear previous errors
        
//         try {
//             const res = await axios.post('http://localhost:5000/api/auth/send-otp', { 
//                 email: user.email 
//             });
    
//             console.log('OTP Response:', res.data); // Debug response
    
//             if (res.data.success) {
//                 // Store the OTP received from backend
//                 setServerOtp(res.data.otp);
//                 setStep(2);
//             } else {
//                 setError(res.data.error || 'Failed to send OTP. Please try again.');
//             }
//         } catch (error) {
//             console.error('OTP Error:', error.response?.data);
//             setError(error.response?.data?.error || 
//                     error.response?.data?.message || 
//                     'Error sending OTP. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     // const sendOtp = async () => {
//     //     if (!user.name || !user.email) {
//     //         setError('Please fill all fields');
//     //         return;
//     //     }

//     //     setIsLoading(true);
//     //     try {
//     //         // const res = await axios.post('http://localhost:5000/api/auth/send-otp', { 
//     //         //     email: user.email 
//     //         // });
//     //         const res = await axios.post('http://localhost:5000/api/auth/send-otp', { email: user.email });
//     //                     console.log(res.data)
//     //         if (res.data.otp) {
//     //             setServerOtp(res.data.otp);
//     //             setStep(2);
//     //         } else {
//     //             setError('Failed to send OTP. Please try again.');
//     //         }
//     //     } catch (error) {
//     //         setError(error.response?.data?.error || 'Error sending OTP');
//     //     } finally {
//     //         setIsLoading(false);
//     //     }
//     // };

//     // const verifyOtp = () => {
//     //     if (!otp) {
//     //         setError('Please enter OTP');
//     //         return;
//     //     }

//     //     if (parseInt(otp) === parseInt(serverOtp)) {
//     //         setStep(3);
//     //         setError('');
//     //     } else {
//     //         setError('Invalid OTP. Please try again.');
//     //     }
//     // };
//     // const verifyOtp = () => {
//     //     if (!otp) {
//     //         setError('Please enter OTP');
//     //         return;
//     //     }
    
//     //     // Compare as strings to avoid type issues
//     //     if (otp.toString().trim() === serverOtp.toString().trim()) {
//     //         setStep(3);
//     //         setError('');
//     //     } else {
//     //         setError('Invalid OTP. Please try again.');
//     //         console.log('OTP comparison failed:', {
//     //             entered: otp,
//     //             server: serverOtp,
//     //             enteredType: typeof otp,
//     //             serverType: typeof serverOtp
//     //         });
//     //     }
//     // };
//     const verifyOtp = () => {
//         if (!otp) {
//             setError('Please enter OTP');
//             return;
//         }
    
//         // Add null check for serverOtp
//         if (!serverOtp) {
//             setError('OTP not received. Please request a new OTP.');
//             return;
//         }
    
//         // Compare as strings to avoid type issues
//         if (otp.toString().trim() === serverOtp.toString().trim()) {
//             setStep(3);
//             setError('');
//         } else {
//             setError('Invalid OTP. Please try again.');
//         }
//     };
//     const handleSignup = async (e) => {
//         e.preventDefault();
        
//         if (user.password !== user.cpassword) {
//             setError('Passwords do not match!');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const res = await axios.post('http://localhost:5000/api/auth/register', {
//                 name: user.name,
//                 email: user.email,
//                 password: user.password,
//                 otp: otp
//             });

//             if (res.data.success) {
//                 alert('Signup successful!');
//                 navigate('/login');
//             }
//         } catch (error) {
//             setError(error.response?.data?.error || 'Signup failed');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Progress steps
//     const steps = [
//         { number: 1, title: 'Basic Info' },
//         { number: 2, title: 'Verify Email' },
//         { number: 3, title: 'Set Password' }
//     ];

//     return (
//         <div className="signup-container">
//             <div className="signup-card">
//                 <div className="signup-left">
//                     <div className="signup-header">
//                         <h1>Join <span className="brand-highlight">HackStreak</span></h1>
//                         <p className="signup-subtitle">
//                             Track coding contests and level up your skills
//                         </p>
//                     </div>

//                     {/* Progress indicator */}
//                     <div className="progress-steps">
//                         {steps.map((stepItem) => (
//                             <div 
//                                 key={stepItem.number} 
//                                 className={`step ${step === stepItem.number ? 'active' : ''} ${step > stepItem.number ? 'completed' : ''}`}
//                             >
//                                 <div className="step-number">
//                                     {step > stepItem.number ? <FaCheck /> : stepItem.number}
//                                 </div>
//                                 <div className="step-title">{stepItem.title}</div>
//                             </div>
//                         ))}
//                     </div>

//                     {error && (
//                         <div className="signup-error">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSignup} className="signup-form">
//                         {step === 1 && (
//                             <div className="step-content">
//                                 <div className="input-group">
//                                     <label htmlFor="name">
//                                         <FaUser className="input-icon" />
//                                         Full Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="name"
//                                         name="name"
//                                         value={user.name}
//                                         onChange={onChange}
//                                         placeholder="Your name"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="input-group">
//                                     <label htmlFor="email">
//                                         <FaEnvelope className="input-icon" />
//                                         Email Address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={user.email}
//                                         onChange={onChange}
//                                         placeholder="your@email.com"
//                                         required
//                                     />
//                                 </div>

//                                 <button 
//                                     type="button" 
//                                     onClick={sendOtp}
//                                     className="signup-button"
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? 'Sending...' : 'Send OTP'}
//                                 </button>
//                             </div>
//                         )}

//                         {step === 2 && (
//                             <div className="step-content">
//                                 <div className="input-group">
//                                     <label htmlFor="otp">
//                                         <FaLock className="input-icon" />
//                                         Verification Code
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="otp"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value)}
//                                         placeholder="Enter 6-digit OTP"
//                                         required
//                                     />
//                                     <small className="otp-note">
//                                         We've sent a code to {user.email}
//                                     </small>
//                                 </div>

//                                 <div className="otp-actions">
//                                     <button 
//                                         type="button" 
//                                         onClick={() => setStep(1)}
//                                         className="back-button"
//                                     >
//                                         Back
//                                     </button>
//                                     <button 
//                                         type="button" 
//                                         onClick={verifyOtp}
//                                         className="signup-button"
//                                     >
//                                         Verify OTP
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {step === 3 && (
//                             <div className="step-content">
//                                 <div className="input-group">
//                                     <label htmlFor="password">
//                                         <FaLock className="input-icon" />
//                                         Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         name="password"
//                                         value={user.password}
//                                         onChange={onChange}
//                                         placeholder="Create password"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="input-group">
//                                     <label htmlFor="cpassword">
//                                         <FaLock className="input-icon" />
//                                         Confirm Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="cpassword"
//                                         name="cpassword"
//                                         value={user.cpassword}
//                                         onChange={onChange}
//                                         placeholder="Confirm password"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="password-requirements">
//                                     <p>Password must contain:</p>
//                                     <ul>
//                                         <li>At least 8 characters</li>
//                                         <li>One uppercase letter</li>
//                                         <li>One number</li>
//                                     </ul>
//                                 </div>

//                                 <button 
//                                     type="submit" 
//                                     className="signup-button"
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? 'Creating account...' : (
//                                         <>
//                                             Complete Signup <FaArrowRight className="arrow-icon" />
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         )}
//                     </form>

//                     <div className="login-redirect">
//                         Already have an account?{' '}
//                         <Link to="/login" className="login-link">
//                             Log in
//                         </Link>
//                     </div>
//                 </div>

//                 <div className="signup-right">
//                     <div className="coding-illustration">
//                         {/* SVG Illustration */}
//                         <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
//                             {/* Monitor */}
//                             <rect x="100" y="50" width="200" height="150" rx="10" fill="#1a1a2e" />
//                             <rect x="110" y="60" width="180" height="130" rx="5" fill="#6e48aa" opacity="0.2" />
                            
//                             {/* Code */}
//                             <text x="120" y="100" fontFamily="'Fira Code', monospace" fontSize="14" fill="#4bc0c8">{'</>'}</text>
//                             <text x="120" y="120" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'// Join the challenge'}</text>
//                             <text x="120" y="140" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'const signup = () => {'}</text>
//                             <text x="120" y="160" fontFamily="'Fira Code', monospace" fontSize="14" fill="#6e48aa">{'  return <HackStreak/>;'}</text>
//                             <text x="120" y="180" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'}'}</text>
                            
//                             {/* Stand */}
//                             <rect x="175" y="200" width="50" height="20" fill="#1a1a2e" />
//                             <rect x="185" y="220" width="30" height="10" fill="#1a1a2e" />
//                         </svg>
//                     </div>
//                     <div className="signup-quote">
//                         <h3>Start Your Coding Journey</h3>
//                         <p>Never miss another important contest</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaArrowRight } from 'react-icons/fa';
import './Signup.css';
const Signup = () => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        cpassword: '' 
    });
    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError('');
    };

    const sendOtp = async () => {
        if (!user.name || !user.email) {
            setError('Please fill all fields');
            return;
        }
    
        setIsLoading(true);
        setError(''); // Clear previous errors
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/send-otp', { 
                email: user.email 
            });
    
            if (res.data.success) {
                setStep(2);
            } else {
                setError(res.data.error || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('OTP Error:', error.response?.data);
            setError(error.response?.data?.error || 
                    error.response?.data?.message || 
                    'Error sending OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOtp = () => {
        if (!otp) {
            setError('Please enter OTP');
            return;
        }
    
        // Move to password step - OTP verification will happen during final submission
        setStep(3);
        setError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (user.password !== user.cpassword) {
            setError('Passwords do not match!');
            return;
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(user.password)) {
            setError('Password must contain at least 8 characters, one uppercase letter, and one number');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name: user.name,
                email: user.email,
                password: user.password,
                otp: otp
            });

            if (res.data.success) {
                // Store token in localStorage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                alert('Signup successful!');
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Progress steps
    const steps = [
        { number: 1, title: 'Basic Info' },
        { number: 2, title: 'Verify Email' },
        { number: 3, title: 'Set Password' }
    ];

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-left">
                    <div className="signup-header">
                        <h1>Join <span className="brand-highlight">HackStreak</span></h1>
                        <p className="signup-subtitle">
                            Track coding contests and level up your skills
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="progress-steps">
                        {steps.map((stepItem) => (
                            <div 
                                key={stepItem.number} 
                                className={`step ${step === stepItem.number ? 'active' : ''} ${step > stepItem.number ? 'completed' : ''}`}
                            >
                                <div className="step-number">
                                    {step > stepItem.number ? <FaCheck /> : stepItem.number}
                                </div>
                                <div className="step-title">{stepItem.title}</div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="signup-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="signup-form">
                        {step === 1 && (
                            <div className="step-content">
                                <div className="input-group">
                                    <label htmlFor="name">
                                        <FaUser className="input-icon" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={user.name}
                                        onChange={onChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="email">
                                        <FaEnvelope className="input-icon" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={user.email}
                                        onChange={onChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <button 
                                    type="button" 
                                    onClick={sendOtp}
                                    className="signup-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <div className="input-group">
                                    <label htmlFor="otp">
                                        <FaLock className="input-icon" />
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit OTP"
                                        required
                                    />
                                    <small className="otp-note">
                                        We've sent a code to {user.email}
                                    </small>
                                </div>

                                <div className="otp-actions">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)}
                                        className="back-button"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={verifyOtp}
                                        className="signup-button"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <div className="input-group">
                                    <label htmlFor="password">
                                        <FaLock className="input-icon" />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={user.password}
                                        onChange={onChange}
                                        placeholder="Create password"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="cpassword">
                                        <FaLock className="input-icon" />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="cpassword"
                                        name="cpassword"
                                        value={user.cpassword}
                                        onChange={onChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>

                                <div className="password-requirements">
                                    <p>Password must contain:</p>
                                    <ul>
                                        <li>At least 8 characters</li>
                                        <li>One uppercase letter</li>
                                        <li>One number</li>
                                    </ul>
                                </div>

                                <button 
                                    type="submit" 
                                    className="signup-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating account...' : (
                                        <>
                                            Complete Signup <FaArrowRight className="arrow-icon" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="login-redirect">
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">
                            Log in
                        </Link>
                    </div>
                </div>

                <div className="signup-right">
                    <div className="coding-illustration">
                        {/* SVG Illustration */}
                        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                            {/* Monitor */}
                            <rect x="100" y="50" width="200" height="150" rx="10" fill="#1a1a2e" />
                            <rect x="110" y="60" width="180" height="130" rx="5" fill="#6e48aa" opacity="0.2" />
                            
                            {/* Code */}
                            <text x="120" y="100" fontFamily="'Fira Code', monospace" fontSize="14" fill="#4bc0c8">{'</>'}</text>
                            <text x="120" y="120" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'// Join the challenge'}</text>
                            <text x="120" y="140" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'const signup = () => {'}</text>
                            <text x="120" y="160" fontFamily="'Fira Code', monospace" fontSize="14" fill="#6e48aa">{'  return <HackStreak/>;'}</text>
                            <text x="120" y="180" fontFamily="'Fira Code', monospace" fontSize="14" fill="#ffffff">{'}'}</text>
                            
                            {/* Stand */}
                            <rect x="175" y="200" width="50" height="20" fill="#1a1a2e" />
                            <rect x="185" y="220" width="30" height="10" fill="#1a1a2e" />
                        </svg>
                    </div>
                    <div className="signup-quote">
                        <h3>Start Your Coding Journey</h3>
                        <p>Never miss another important contest</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;