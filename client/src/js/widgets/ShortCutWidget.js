import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Segment, Grid, Header, Image, Rail, Sticky, Divider } from 'semantic-ui-react';

const Placeholder = () => <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />;

export class ShortCutWidget extends Component {
  state = {};

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    const { contextRef } = this.state;

    return (
      <Grid centered columns={3}>
        <Grid.Column>
          <div ref={this.handleContextRef}>
            <Rail position="right">
              <Sticky context={contextRef}>
                <NavLink to={'#'}>Mine varslinger</NavLink>
                <Divider hidden />
                <NavLink to={'#'}>Mine varslinger</NavLink>
                <Divider hidden />
                <NavLink to={'#'}>Mine varslinger</NavLink>
              </Sticky>
            </Rail>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
