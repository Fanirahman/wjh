const express = require('express');
const bodyParser = require('body-parser');
const bizSdk = require('facebook-nodejs-business-sdk');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

const app = express();
const port = 3000;

app.use(bodyParser.json());

const access_token = 'EAAajC2WHzkoBO0u9RXLb1xpGAa0ro80WcFAuGBU8KVlaJjitccxAmgMvvcCeXzlhxBwZB0AcDPadKQyfuI7XDV4pHZCxjbEZCJpOP19xzPME3dqWRXL06VlznB3V6xHWBCyNbq0InfQ8kQWoAb8yV5ZBa1LEEdZANlK30xzPKrpl0zyPQq9Q6qNqhhP2LPM1VrwZDZD';
const pixel_id = '3571245113185821';
const api = bizSdk.FacebookAdsApi.init(access_token);

app.post('/track', (req, res) => {
    try {
        const { event_id, event_name, event_time, user_data, custom_data, action_source } = req.body;

        // Prepare user data
        const userData = (new UserData())
            .setEmails(user_data.em ? [user_data.em] : [])
            .setPhones(user_data.ph ? [user_data.ph] : [])
            .setClientUserAgent(user_data.client_user_agent);

        // Prepare custom data
        const customData = (new CustomData())
            .setValue(custom_data.value)
            .setCurrency(custom_data.currency);

        // Prepare server event
        const serverEvent = (new ServerEvent())
            .setEventName(event_name)
            .setEventTime(event_time)
            .setUserData(userData)
            .setCustomData(customData)
            .setActionSource(action_source);

        // Send event request
        const eventsData = [serverEvent];
        const eventRequest = (new EventRequest(access_token, pixel_id))
            .setEvents(eventsData);

        eventRequest.execute()
            .then(response => {
                console.log('Event sent to Facebook:', response);
                res.json({ message: 'Event tracked and sent to Facebook successfully' });
            })
            .catch(error => {
                console.error('Error sending event to Facebook:', error);
                res.status(500).json({ message: 'Error sending event to Facebook', error });
            });

    } catch (error) {
        console.error('Error processing tracking request:', error);
        res.status(500).json({ message: 'Error processing tracking request', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
