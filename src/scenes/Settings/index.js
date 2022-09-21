import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import axios from '../../services/axios';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  fill: {
    width: '100%',
  },
});

class Settings extends Component {
  state = {
    settingList: [],
    dialogOpen: false,
    editDialogOpen: false,
    selectedId: '',
    selectedText: ''
  }

  componentDidMount() {
    const { user } = this.props;
    const config = {
      headers: {
        'Authorization': user.token,
      }
    };
    axios.get('/settings/all', config)
      .then(res => {
        this.setState({ settingList: res.data });
      });
  }

  handleUpdate = event => {
    if (this.state.selectedText) {
      const { user } = this.props;
      const formData = {
        id: this.state.selectedId,
        text: this.state.selectedText,
        updatedDate: new Date(),
      }

      const config = {
        headers: {
          'Authorization': user.token,
        }
      };
    
      axios.put('/settings/update', formData, config)
      .then(res => {
          console.log(res.data)
          var arr = this.state.settingList;
          if (arr.some(item => item._id === res.data._id)) {
            arr = arr.map(x => (x._id === res.data._id ? { ...x, text: res.data.text } : x))
          }else{
            arr.push(res.data)
          }
          this.setState({ settingList: arr })  
          this.setState({ editDialogOpen: false })
      })
      .catch(err => console.log(err));
    }
  }

  handleDelete = () => {
    const { user } = this.props;
    this.setState(prevState => ({ dialogOpen: !prevState.dialogOpen }))
    var config = {
      headers: {
        'Authorization': user.token,
      }
    };
    axios.post('/settings/delete', {id: this.state.selectedId}, config)
    .then(res => {
        const arr = this.state.settingList;
        arr.splice(this.state.settingList.findIndex(item => item._id === this.state.selectedId), 1);
        this.setState({ settingList: arr })    
    })
    .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const { settingList } = this.state;

    return (
      <React.Fragment>
        <IconButton onClick={()=>{ this.setState({editDialogOpen: true}) }}>
            <AddIcon />
        </IconButton>   
        <Paper className={classes.root}>
          { !this.state.editDialogOpen && (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Text</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {settingList.map(u => {
                return (
                  <TableRow key={u._id}>
                    <TableCell>{u.text}</TableCell>
                    <TableCell>{moment(u.createdDate).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    <TableCell>
                      <IconButton onClick={e => {
                          this.setState({selectedId: u._id})
                          this.setState({selectedText: u.text})
                          this.setState({editDialogOpen: true})
                        }}>
                        <EditIcon />
                      </IconButton>   
                      <IconButton onClick={e => {
                          this.setState({selectedId: u._id})
                          this.setState(prevState => ({ dialogOpen: !prevState.dialogOpen }))
                        }}>
                        <DeleteIcon />
                      </IconButton>   
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>)}
          <Dialog
            open={this.state.dialogOpen}
            onClose={()=>{this.setState(prevState => ({ dialogOpen: !prevState.dialogOpen }))}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableEnforceFocus
          >
            <DialogTitle id="alert-dialog-title">Are you sure you want to delete?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{this.setState(prevState => ({ dialogOpen: !prevState.dialogOpen }))}} color="primary">
                No
              </Button>
              <Button onClick={this.handleDelete} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          { this.state.editDialogOpen && (
          <Grid
              container
              direction="row"
              align = "center" 
              justify = "center" 
              alignItems = "center"
              style={{padding:20}}
            >
              <Grid item xs={12}>
                <FormControl className={[classes.margin, classes.fill].join(' ')}>
                  <InputLabel htmlFor="text">Add text for participants to see</InputLabel>
                  <Input
                    id="text"
                    name="text"
                    type="text"
                    value={this.state.selectedText}
                    multiline={true}
                    rows={20}
                    onChange={(event)=>{this.setState({selectedText: event.target.value})}}
                  />
                </FormControl>         
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button type="submit" variant="raised" color="primary" onClick={this.handleUpdate}>
                  { this.state.selectedId ? 'Update' : 'Add'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="raised" color="primary" onClick={()=>this.setState({editDialogOpen: false})}>
                  Back
                </Button>
              </Grid>
          </Grid> )}
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, {}),
)(Settings);