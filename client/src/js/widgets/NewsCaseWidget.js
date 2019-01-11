import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image } from 'semantic-ui-react';

//import {} from './';

export class NewsCaseWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment color="teal">
        <Container>
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <Header as="h2">{this.props.title}</Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <p>{this.props.date}</p>
                <p>
                  <i>{this.props.time}</i>
                </p>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment vertical>
            <Container>
              <Grid divided inverted stackable>
                <Grid.Column width={4} align="right" only="mobile">
                  <Image
                    fluid
                    src={this.props.imageURL}
                    //as='a'
                    //href='http://localhost:3000/#/widget'
                    target="_blank"
                  />
                </Grid.Column>
                <Grid.Column width={12} textAlign="left">
                  <p>{this.props.description}</p>
                </Grid.Column>
                <Grid.Column width={4} align="right" only="tablet computer">
                  <Image
                    fluid
                    src={this.props.imageURL}
                    //as='a'
                    //href='http://localhost:3000/#/widget'
                    target="_blank"
                  />
                </Grid.Column>
              </Grid>
            </Container>
          </Segment>
          <List link>
            <List.Item as="a">Hendelses-adresse: {this.props.address}</List.Item>
            <List.Item as="a">Oppdrag utføres av: {this.props.company}</List.Item>
          </List>
        </Container>

        <Container>
          <Grid verticalAlign="middle">
            <Grid.Column>
              <Form size="large">
                <Segment stacked>
                  <Form.Field>
                    <label>Hva vil du melde inn?</label>
                    <Input
                      fluid
                      icon="warning"
                      iconPosition="left"
                      placeholder={'Hva er problemet?'}
                      value={this.state.headline}
                      onChange={(event, data) => {
                        this.handleInput('headline', data.value);
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Utdyp problemet</label>
                    <TextArea
                      fluid
                      icon="comment"
                      iconPosition="left"
                      placeholder={'Utdyp'}
                      value={this.state.details}
                      onChange={(event, data) => {
                        this.handleInput('details', data.value);
                      }}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Grid columns={'equal'}>
                      <Grid.Column>
                        <label>Kategori</label>
                        <Dropdown
                          fluid
                          search
                          selection
                          options={this.state.categoryOptions}
                          placeholder="Kategori"
                          onChange={(event, data) => {
                            this.handleInput('category', data.value);
                            this.setState({ selectedCategory: true });
                            this.getSubCategories();
                          }}
                        />
                      </Grid.Column>
                      <Grid.Column>
                        <label>Underkategori</label>
                        <Dropdown
                          disabled={!this.state.selectedCategory}
                          fluid
                          search
                          selection
                          options={this.state.subCategoryOptions}
                          placeholder={'Underkategori'}
                          value={this.state.subcategory}
                          onChange={(event, data) => {
                            this.handleInput('subcategory', data.value);
                          }}
                        />
                      </Grid.Column>
                    </Grid>
                  </Form.Field>
                  <Segment placeholder>
                    <Header icon>
                      <Icon name="image file outline" />
                      Bildemodul her.
                    </Header>
                    <Button primary>Legg til bilde</Button>
                  </Segment>
                  <Form.Field>
                    <Checkbox
                      label={<label>Jeg ønsker å abonnere på saken</label>}
                      fluid
                      value={this.state.subscription}
                      onChange={(event, data) => {
                        this.handleInput('subscription', data.checked);
                      }}
                    />
                  </Form.Field>

                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() => {
                      this.submit();
                    }}
                  >
                    Send inn
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
    );
  }
}
