import { Switch, Route } from 'react-router-dom';
import Boards from '../pages/Table';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Tags from '../pages/Tags';


const Routes: React.FC = () => {
    return (
        <Switch>
            <Route path="/table/:id" exact component={Boards}/>
            <Route path="/tags" exact component={Tags}/>
            <Route path="/home" exact component={Dashboard}/>
            <Route path="/*" exact component={NotFound}/>
        </Switch>
    )
}

export default Routes;
