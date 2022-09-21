import React from 'react';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import SettingIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import List, { ListSubheader, ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import './style.scss';

const NavigationList = props => {
  return (
    <List 
      className="nav-link"
      component="nav"
      subheader={<ListSubheader component="div">Menu</ListSubheader>}
    >
      <ListItem component={NavLink} exact to="/guests/all" button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Participants" />
      </ListItem>
      <ListItem component={NavLink} exact to="/settings/all" button>
        <ListItemIcon>
          <SettingIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem component={NavLink} exact to="/users/all" button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Administrators" />
      </ListItem>
    </List>
  );
}

export default NavigationList;