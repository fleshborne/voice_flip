import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Typography from 'material-ui/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import axios from '../../services/axios';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Guests extends Component {
  state = {
    guestList: [],
    dialogOpen: false,
    selectedId: '',
  };

  componentDidMount() {
    const { user } = this.props;
    const config = {
      headers: {
        Authorization: user.token,
      },
    };
    console.log(user);
    axios.get('/guests/all', config).then((res) => {
      console.log(res.data);
      this.setState({ guestList: res.data });
    });
  }

  handleDelete = () => {
    const { user } = this.props;
    this.setState((prevState) => ({ dialogOpen: !prevState.dialogOpen }));
    var config = {
      headers: {
        Authorization: user.token,
      },
    };
    axios
      .post('/guests/delete', { id: this.state.selectedId }, config)
      .then((res) => {
        const arr = this.state.guestList;
        arr.splice(
          this.state.guestList.findIndex(
            (item) => item._id === this.state.selectedId
          ),
          1
        );
        this.setState({ guestList: arr });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { classes } = this.props;
    const { guestList } = this.state;

    return (
      <React.Fragment>
        <Typography variant='subheading' color='textSecondary' noWrap>
          Participants List
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Voice</TableCell>
                <TableCell>Pitch</TableCell>
                <TableCell>Pace</TableCell>
                <TableCell>Voice Wish</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guestList.map((u) => {
                return (
                  <TableRow key={u._id}>
                    <TableCell component='th' scope='row'>
                      {u.name}
                    </TableCell>

                    <TableCell>{u.country}</TableCell>
                    <TableCell>{u.gender}</TableCell>
                    <TableCell>{u.voice}</TableCell>
                    <TableCell>{u.pitch}</TableCell>
                    <TableCell>{u.pace}</TableCell>
                    <TableCell>{u.voiceWish}</TableCell>

                    <TableCell>
                      {moment(u.createdDate).format('MMMM Do YYYY, h:mm:ss a')}
                    </TableCell>
                    <TableCell>
                      <audio
                        controls
                        src={'http://localhost:8001/public/' + u.filename}
                      >
                        Your browser does not support the
                        <code>audio</code> element.
                      </audio>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          this.setState({ selectedId: u._id });
                          this.setState((prevState) => ({
                            dialogOpen: !prevState.dialogOpen,
                          }));
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.dialogOpen}
            onClose={() => {
              this.setState((prevState) => ({
                dialogOpen: !prevState.dialogOpen,
              }));
            }}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            disableEnforceFocus
          >
            <DialogTitle id='alert-dialog-title'>
              Are you sure you want to delete?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'></DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState((prevState) => ({
                    dialogOpen: !prevState.dialogOpen,
                  }));
                }}
                color='primary'
              >
                No
              </Button>
              <Button onClick={this.handleDelete} color='primary' autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, {})
)(Guests);
