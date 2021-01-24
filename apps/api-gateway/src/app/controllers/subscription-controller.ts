import { NOTFOUND } from 'dns';
import * as express from 'express';

class SubscriptionController {

    constructor(){}

    addSubscription(request: express.Request, response: express.Response){
        const body = request.body;
        
        if(!('url' in request.body))
        {
            response.sendStatus(404);
            response.end();
        }
    }
};

export default SubscriptionController;