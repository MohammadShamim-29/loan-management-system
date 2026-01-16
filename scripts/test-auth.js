const API_URL = 'http://localhost:5000/api/auth';
const USER_API_URL = 'http://localhost:5000/api/users';

const testAuth = async () => {
    try {
        // 1. Register
        const user = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            phone: '1234567890',
            password: 'password123'
        };
        console.log('Registering user:', user.email);

        let res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!res.ok) throw new Error(await res.text());
        console.log('User registered.');

        // 2. Login
        console.log('Logging in...');
        res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (!res.ok) throw new Error(await res.text());
        const loginData = await res.json();
        const token = loginData.token;
        console.log('Logged in. Token received.');

        // 3. Get Profile
        console.log('Fetching profile...');
        res = await fetch(`${USER_API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(await res.text());
        const profileData = await res.json();
        console.log('Profile fetched:', profileData.email);

        if (profileData.email === user.email) {
            console.log('SUCCESS: Auth flow verified.');
        } else {
            console.error('FAILURE: Profile email mismatch.');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
    }
};

testAuth();
