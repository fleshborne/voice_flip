import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { login } from '../../services/users/actions';
import { Recorder } from 'react-voice-recorder';
import 'react-voice-recorder/dist/index.css';
import { compose } from 'redux';
import axios from '../../services/axios';
import { Card, List } from 'material-ui';
import Axios from 'axios';
import { LoremIpsum } from 'lorem-ipsum';
const { createRef } = React;

// const Accordion = styled((props) => (
//   <MuiAccordion disableGutters elevation={0} square {...props} />
// ))(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   '&:not(:last-child)': {
//     borderBottom: 0,
//   },
//   '&:before': {
//     display: 'none',
//   },
// }));

// const AccordionSummary = styled((props) => (
//   <MuiAccordionSummary
//     expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
//     {...props}
//   />
// ))(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === 'dark'
//       ? 'rgba(255, 255, 255, .05)'
//       : 'rgba(0, 0, 0, .03)',
//   flexDirection: 'row-reverse',
//   '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
//     transform: 'rotate(90deg)',
//   },
//   '& .MuiAccordionSummary-content': {
//     marginLeft: theme.spacing(1),
//   },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: '1px solid rgba(0, 0, 0, .125)',
// }));

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  fill: {
    flexBasis: '100%',
  },
});
const speechBox = {
  marginLeft: 30,
  paddingLeft: 30,
  marginRight: 30,
  paddingRight: 30,
};
class Index extends Component {
  state = {
    id: '',
    name: '',
    home: '',
    country: '',
    gender: '',
    age: '',
    voice: '',
    pitch: '',
    pace: '',
    voiceWish: '',
    randomTextIndex: 0,
    hide: false,
    settingList: [],
    fruits: ['🍒', '🍉', '🍊', '🍓', '🍇', '🥝'],
    fruit1: '🍒',
    fruit2: '🍒',
    fruit3: '🍒',
    rolling: false,
    audioDetails: {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    },
  };

  slotRef = [createRef(), createRef(), createRef()];
  // to trigger roolling and maintain state
  roll = () => {
    this.setState({
      rolling: true,
    });
    setTimeout(() => {
      this.setState({ rolling: false });
    }, 700);

    // looping through all 3 slots to start rolling
    this.slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selected = this.triggerSlotRotation(slot.current);
      this.setState({ [`fruit${i + 1}`]: selected });
    });

    var randomTextIndex = this.state.randomTextIndex;
    while (randomTextIndex == this.state.randomTextIndex) {
      randomTextIndex = Math.floor(
        Math.random() * this.state.settingList.length
      );
    }
    this.setState({ randomTextIndex });
  };
  // this will create a rolling effect and return random selected option
  triggerSlotRotation = (ref) => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;
    let randomOption = Math.floor(Math.random() * this.state.fruits.length);
    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return this.state.fruits[randomOption];
  };

  handleAudioStop(data) {
    this.setState({ audioDetails: data });
  }

  handleAudioUpload(file) {
    if (file) {
      const fd = new FormData();
      fd.append('audioFile', file, 'test.webm');
      fd.append('id', this.state.id);
      axios
        .post('/guests/audio', fd)
        .then((res) => {
          const { id } = res.data;
          this.setState({ id: id });
        })
        .catch((err) => console.log(err));
    }
  }

  componentDidMount() {
    axios.get('/settings/all').then((res) => {
      this.setState({ settingList: res.data });
      console.log(res.data);
    });
  }

  handleCountDown(data) {}

  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    this.setState({ audioDetails: reset });
  }

  handleRegister() {
    const data = {
      id: this.state.id,
      name: this.state.name,
      lastName: this.state.lastName,
      country: this.state.country,
      age: this.state.age,
      voice: this.state.voice,
      pitch: this.state.pitch,
      pace: this.state.pace,
      gender: this.state.gender,
      voiceWish: this.state.voiceWish,
      updatedDate: new Date(),
    };

    if (this.state.id) {
      axios
        .put('/guests/update', data)
        .then((res) => {})
        .catch((err) => console.log(err));
    } else {
      axios
        .post('/guests/register', data)
        .then((res) => {
          const { id } = res.data;
          this.setState({ id: id });
        })
        .catch((err) => console.log(err));
    }
  }

  handleIndex = (event) => {
    const { email, password } = event.target;
    const data = {
      email: email.value,
      password: password.value,
    };

    this.props.login(data);

    event.preventDefault();
  };

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  getSpeech() {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 5,
        min: 2,
      },
      wordsPerSentence: {
        max: 16,
        min: 6,
      },
    });

    return <Card>{<p>{lorem.generateParagraphs(2)}</p>}</Card>;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction='row'
          align='center'
          justify='center'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Typography style={{ fontSize: '25px' }}>
              Speech and Voice Survey 2022
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify='space-between'
          direction='row'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Typography
              style={{
                marginTop: 20,
                marginBottom: 20,
                justifyContent: 'center',
              }}
            >
              Thank you for participating in our random voice sample project!{' '}
              <br />
              Please ensure you are in a quiet area as to provide better sound
              quality!
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify='space-between'
          direction='row'
          alignItems='center'
        >
          <Grid item>
            <Button
              variant='flat'
              onClick={() => {
                this.setState({ hide: !this.state.hide });
              }}
            >
              {this.state.hide ? 'Survey' : 'Record'}
            </Button>
          </Grid>
        </Grid>
        {!this.state.hide && (
          <Grid container className={classes.fill}>
            <Grid
              container
              justify='space-between'
              direction='row'
              alignItems='center'
            >
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={[classes.margin, classes.fill].join(' ')}
                >
                  <InputLabel htmlFor='name'>First Name</InputLabel>
                  <Input
                    name='name'
                    id='name'
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={[classes.margin, classes.fill].join(' ')}
                >
                  <InputLabel htmlFor='lastName'>
                    Last Name (Optional)
                  </InputLabel>
                  <Input
                    name='lastName'
                    id='lastName'
                    value={this.state.lastName}
                    onChange={this.handleChange('lastName')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={[classes.margin, classes.fill].join(' ')}
                >
                  <InputLabel htmlFor='country'>Country of Origin</InputLabel>
                  <Input
                    name='country'
                    id='country'
                    value={this.state.country}
                    onChange={this.handleChange('country')}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid
              container
              justify='space-between'
              direction='row'
              alignItems='center'
            >
              <Grid item xs={4} sm={3}>
                <Typography>I am :</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <RadioGroup
                  className={classes.fill}
                  defaultValue='male'
                  value={this.state.gender}
                  onChange={this.handleChange('gender')}
                  row
                >
                  <FormControlLabel
                    value='male'
                    control={<Radio />}
                    label='male'
                  />
                  <FormControlLabel
                    value='female'
                    control={<Radio />}
                    label='female'
                  />
                  <FormControlLabel
                    value='decline'
                    control={<Radio />}
                    label='decline'
                  />
                </RadioGroup>
              </Grid>
            </Grid>

            <Grid
              container
              justify='space-between'
              direction='row'
              alignItems='center'
            >
              <Grid item xs={4} sm={3}>
                <Typography>My Voice Strength is :</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <RadioGroup
                  className={classes.fill}
                  defaultValue='male'
                  value={this.state.voice}
                  onChange={this.handleChange('voice')}
                  row
                >
                  <FormControlLabel
                    value='soft'
                    control={<Radio />}
                    label='soft'
                  />
                  <FormControlLabel
                    value='medium'
                    control={<Radio />}
                    label='medium'
                  />
                  <FormControlLabel
                    value='strong'
                    control={<Radio />}
                    label='strong'
                  />
                  <FormControlLabel
                    value='decline'
                    control={<Radio />}
                    label='decline'
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid
              container
              justify='space-between'
              direction='row'
              alignItems='center'
            >
              <Grid item xs={4} sm={3}>
                <Typography>My Voice Pitch Is :</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <RadioGroup
                  className={classes.fill}
                  defaultValue='male'
                  value={this.state.pitch}
                  onChange={this.handleChange('pitch')}
                  row
                >
                  <FormControlLabel
                    value='high'
                    control={<Radio />}
                    label='high'
                  />
                  <FormControlLabel
                    value='medium'
                    control={<Radio />}
                    label='medium'
                  />
                  <FormControlLabel
                    value='low'
                    control={<Radio />}
                    label='low'
                  />
                  <FormControlLabel
                    value='decline'
                    control={<Radio />}
                    label='decline'
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid
              container
              justify='space-between'
              direction='row'
              alignItems='center'
            >
              <Grid item xs={4} sm={3}>
                <Typography>My Speaking Pace is :</Typography>
              </Grid>
              <Grid item xs={8} sm={9}>
                <RadioGroup
                  className={classes.fill}
                  defaultValue='pace'
                  value={this.state.pace}
                  onChange={this.handleChange('pace')}
                  row
                >
                  <FormControlLabel
                    value='slower'
                    control={<Radio />}
                    label='slower'
                  />
                  <FormControlLabel
                    value='average'
                    control={<Radio />}
                    label='average'
                  />
                  <FormControlLabel
                    value='fast'
                    control={<Radio />}
                    label='fast'
                  />
                  <FormControlLabel
                    value='decline'
                    control={<Radio />}
                    label='decline'
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid container align='center' justify='center'>
              <InputLabel>
                If I could change my voice to sound like any celebrity, I would
                want to sound like:
              </InputLabel>
              <Grid item xs={12} sm={4}>
                <FormControl
                  className={[classes.margin, classes.fill].join(' ')}
                >
                  <Input
                    name='voiceWish'
                    id='voiceWish'
                    value={this.state.voiceWish}
                    onChange={this.handleChange('voiceWish')}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='raised'
                  color='primary'
                  style={{ margin: 30 }}
                  onClick={() => {
                    this.handleRegister();
                    this.setState({ hide: !this.state.hide });
                  }}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {this.state.hide && (
          <Grid
            container
            align='center'
            justify='center'
            alignItems='center'
            direction='row'
          >
            {/* <Grid item xs={12} sm={12} md={6}>
              <div className='SlotMachine'>
                <div className='slot'>
                  <section>
                    <div className='container' ref={this.slotRef[0]}>
                      {this.state.fruits.map((fruit, i) => (
                        <div key={i}>
                          <span>{fruit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <div className='slot'>
                  <section>
                    <div className='container' ref={this.slotRef[1]}>
                      {this.state.fruits.map((fruit, i) => (
                        <div key={i}>
                          <span>{fruit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <div className='slot'>
                  <section>
                    <div className='container' ref={this.slotRef[2]}>
                      {this.state.fruits.map((fruit, i) => (
                        <div key={i}>
                          <span>{fruit}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <div
                  className={!this.state.rolling ? 'roll rolling' : 'roll'}
                  onClick={!this.state.rolling && this.roll}
                  disabled={this.state.rolling}
                >
                  {this.state.rolling ? 'Rolling...' : 'ROLL'}
                </div>
              </div>
              {this.state.settingList.length > this.state.randomTextIndex && (
                <div style={{ fontSize: 25 }}>
                  {this.state.settingList[this.state.randomTextIndex].text
                    .split('\n')
                    .map((it, i) => (
                      <div key={'x' + i}>{it}</div>
                    ))}
                </div>
              )}
            </Grid> */}
            <Grid item xs={12} sm={12} md={6}>
              <div>
                <Card>
                  Last week a child from the south said their mother took a
                  community of children between a common area and a busy road.
                  She also ran upon an animal with a different shape. The woman
                  saw it at the top of a tree. As she looked towards it, the
                  thing began to turn. One eye was half green and blue, the
                  other was like a deep river. In that hour it found her! I
                  would give money to take part in such a real song. The point
                  of the experience is to try and use my voice for each vowel
                  and word and sentence. Like most machines need new oil, a
                  nation needs men and women to have life. Get a million to see
                  the moon and a star and soon the sound they sing will set the
                  next science run. Oh! To be less than a mile from know land….
                  Step out of mind for a minute
                </Card>
              </div>
              {/* <Card style={speechBox}>
                <Button
                  id='generateSpeech'
                  color='primary'
                  style={{ margin: 30 }}
                  onClick={() => {
                    this.getSpeech();
                  }}
                >
                  Generate Speech
                </Button>
                <Typography>
                  Suspendisse eleifend ultrices purus, vel malesuada tellus
                  imperdiet quis. Donec volutpat facilisis lobortis. Vivamus
                  tortor velit, vulputate at fermentum non, rutrum eget velit.
                  Pellentesque nec tortor quis felis scelerisque efficitur.
                  Donec libero turpis, tincidunt quis ullamcorper vel, dapibus
                  eget libero. Fusce fringilla egestas nibh faucibus suscipit.
                  Etiam ac massa interdum libero lacinia mollis.
                </Typography>
              </Card> */}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Recorder
                record={true}
                title={'Flip recording'}
                audioURL={this.state.audioDetails.url}
                showUIAudio
                handleAudioStop={(data) => this.handleAudioStop(data)}
                handleAudioUpload={(data) => this.handleAudioUpload(data)}
                handleCountDown={(data) => this.handleCountDown(data)}
                handleReset={() => this.handleReset()}
                mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
              />

              <Grid item xs={12} justify='center'></Grid>
            </Grid>
            <Button
              variant='raised'
              color='primary'
              style={{ margin: 30 }}
              onClick={() => {
                this.handleRegister();
                this.setState({ hide: !this.state.hide });
              }}
            >
              Finish and Exit
            </Button>
          </Grid>
        )}

        <Grid
          container
          align='center'
          justify='center'
          alignItems='center'
          direction='row'
        >
          <Grid item xs={12} style={{ marginTop: 30 }}>
            <Typography>
              All data is for Speech and Linguistic Training Purposes
            </Typography>
            <Typography>
              No data will be shared with any 3rd party, ever.
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  error: state.error,
});

export default withRouter(
  compose(withStyles(styles), connect(mapStateToProps, { login }))(Index)
);
