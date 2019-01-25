import React from 'react';
import { Button, Segment, Dropdown, Label, Divider, Grid } from 'semantic-ui-react';
import moment from 'moment';
import { municipalService } from '../services/MunicipalServices';
import { Consumer } from './../context';
import FileSaver from 'file-saver';

export class StatisticsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: [],
      month: [
        { text: '1', value: '01' },
        { text: '2', value: '02' },
        { text: '3', value: '03' },
        { text: '4', value: '04' },
        { text: '5', value: '05' },
        { text: '6', value: '06' },
        { text: '7', value: '07' },
        { text: '8', value: '08' },
        { text: '9', value: '09' },
        { text: '10', value: '10' },
        { text: '11', value: '11' },
        { text: '12', value: '12' }
      ],
      week: [],
      selYear: '',
      selMonth: '',
      selWeek: '',
      municipalId: null,
      loading1: false,
      loading2: false,
      loading3: false
    };
  }

  componentWillMount(props) {
    this.setState({ municipalId: Consumer._currentValue.user.municipalId });
    let weeks = [];
    for (let i = 1; i < 53; i++) {
      weeks.push({ text: i, value: i });
    }
    let Start = new Date('January 1, 2018 11:13:00');
    let End = Date.now();
    let years = moment(End).diff(Start, 'years');
    let yearsBetween = [];
    for (let year = years; year >= years - 1; year--) {
      yearsBetween.push({ text: Start.getFullYear() + year, value: Start.getFullYear() + year });
    }

    this.setState({ week: weeks, year: yearsBetween });
  }

  handleChange = (name, value) => {
    console.log(name, value);
    this.setState({ [name]: value });
  };

  handleGetState = type => {
    if (type === 'year') {
      this.setState({ loading1: true });
      municipalService.getMunicipalStatistics(this.state.municipalId, this.state.selYear, null, null).then(res => {
        let file = new Blob([res], { type: 'application/pdf' });
        FileSaver.saveAs(file, 'hverdagshelt-' + this.state.municipalId + '-' + this.state.selYear + '.pdf');
        this.setState({ loading1: false });
      });
    }
    if (type === 'month') {
      this.setState({ loading2: true });
      municipalService
        .getMunicipalStatistics(this.state.municipalId, this.state.selYear, this.state.selMonth, null)
        .then(res => {
          let file = new Blob([res], { type: 'application/pdf' });
          FileSaver.saveAs(
            file,
            'hverdagshelt-' +
              this.state.municipalId +
              '-' +
              this.state.selYear +
              '-month' +
              this.state.selMonth +
              '.pdf'
          );
          this.setState({ loading2: false });
        });
    }
    if (type === 'week') {
      this.setState({ loading3: true });
      municipalService
        .getMunicipalStatistics(this.state.municipalId, this.state.selYear, null, this.state.selWeek)
        .then(res => {
          let file = new Blob([res], { type: 'application/pdf' });
          FileSaver.saveAs(
            file,
            'hverdagshelt-' + this.state.municipalId + '-' + this.state.selYear + '-week' + this.state.selWeek + '.pdf'
          );
          this.setState({ loading3: false });
        });
    }
  };

  render() {
    return (
      <>
        <Grid>
          <Grid.Column width="4">
            <Dropdown
              placeholder="Velg år"
              search
              fluid
              selection
              options={this.state.year}
              onChange={(event, data) => {
                this.handleChange('selYear', data.value);
              }}
            />
          </Grid.Column>
          <Grid.Column width="4">
            <Button
              loading={this.state.loading1}
              fluid
              floated={'right'}
              content="Last ned for år"
              color={'blue'}
              icon={'download'}
              disabled={!this.state.selYear}
              onClick={() => {
                this.handleGetState('year');
              }}
            />
          </Grid.Column>
        </Grid>
        {this.state.selYear ? (
          <Grid>
            <Grid.Column width="4">
              <Dropdown
                placeholder="Velg måned"
                search
                fluid
                selection
                options={this.state.month}
                onChange={(event, data) => {
                  this.handleChange('selMonth', data.value);
                }}
              />
            </Grid.Column>
            <Grid.Column width="4">
              <Button
                loading={this.state.loading2}
                fluid
                content="Last ned for måned"
                floated={'right'}
                color={'blue'}
                icon={'download'}
                disabled={!this.state.selMonth}
                onClick={() => {
                  this.handleGetState('month');
                }}
              />
            </Grid.Column>
          </Grid>
        ) : null}
        {this.state.selYear ? (
          <Grid>
            <Grid.Column width="4">
              <Dropdown
                placeholder="Velg uke nr"
                search
                fluid
                selection
                options={this.state.week}
                onChange={(event, data) => {
                  this.handleChange('selWeek', data.value);
                }}
              />
            </Grid.Column>
            <Grid.Column width="4">
              <Button
                loading={this.state.loading3}
                fluid
                content={'Last ned for uke'}
                floated={'right'}
                disabled={!this.state.selWeek}
                color={'blue'}
                icon={'download'}
                onClick={() => {
                  this.handleGetState('week');
                }}
              />
            </Grid.Column>
          </Grid>
        ) : null}
      </>
    );
  }
}
