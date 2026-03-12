const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.CHILEXPRESS_API_KEY;

async function findCountyCode(countyName) {
    console.log(`Searching code for: ${countyName}`);
    try {
        const response = await axios.get('https://api.chilexpress.cl/georeference/v1/counties', {
            headers: {
                'Ocp-Apim-Subscription-Key': API_KEY
            }
        });
        const counties = response.data.data;
        const match = counties.find(c => c.countyName.toUpperCase().includes(countyName.toUpperCase()));
        if (match) {
            console.log(`Found! Code for ${countyName}: ${match.countyCode}`);
            return match.countyCode;
        }
        console.log(`No code found for ${countyName}`);
    } catch (error) {
        console.error('Coverage Error:', error.response?.data || error.message);
    }
    return null;
}

async function testWithCode() {
    const originCode = await findCountyCode('LA FLORIDA');
    if (originCode) {
        await testQuote(originCode, 'SNTGO'); // Santiago Center usually SNTGO
    }
}

async function testQuote(origin, destination) {
    console.log(`Testing quote from ${origin} to ${destination}`);
    try {
        const response = await axios.post('https://api.chilexpress.cl/shipping/v1/quotes', {
            originCountyCode: origin,
            destinationCountyCode: destination,
            package: {
                weight: "0.2",
                height: "10",
                width: "10",
                length: "10"
            },
            productType: 3
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': API_KEY
            }
        });
        console.log('Success:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Quote Error:', error.response?.data || error.message);
    }
}

testWithCode();
