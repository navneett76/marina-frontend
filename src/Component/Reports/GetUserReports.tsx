import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import "../dashboard/Dashboard.css";

interface InsightData {
    name: string;
    value: number;
}

const UserReportComponent = () => {
    const insightData: InsightData[] = [
        { name: 'Total Customers', value: 12 },
        { name: 'Total Customers', value: 5 },
        { name: 'Total Customers', value: 7 },
        { name: 'Total Customers', value: 8 },
        { name: 'Total Customers', value: 5 },
        { name: 'Total Customers', value: 12 },
        // Add more insights as needed
    ];

    return (
        <>

            <Container maxWidth="lg">

                {/* Insights */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Typography variant="h5" component="h2">
                            Insights
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={insightData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

            </Container>
        </>

    );
};
export default UserReportComponent;