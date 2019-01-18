import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Modal,
  Segment,
  TextArea
} from 'semantic-ui-react';

import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';

export class TicketFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address ? this.props.address : '',
      latlng: this.props.latlng ? this.props.latlng : [null, null],
      headline: '',
      details: '',
      category: this.props.ticket ? this.props.ticket.categoryId : '',
      categoryOptions: [],
      receivedCategory: this.props.ticket ? this.props.ticket.categoryId : '',
      subcategory: '',
      subCategoryOptions: [],
      position: [null, null],
      subscription: 'false',
      selectedCategory: false,
      modalMessage: '',
      modalOpen: false,
      image: null
    };
  }
  close = () => this.setState({ modalOpen: false });

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      console.log(this.props);
      this.setState({ address: this.props.address, latlng: this.props.latlng });
    }
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  getSubCategories(category) {
    let bool = false;
    //Get subcategories based on the chosen category
    categoryService.getSubCategories(category).then(res => {
      let subcats = [];
      res.data.map(subCat => {
        if (this.state.receivedCategory === subCat.id) {
          this.setState({ category: subCat.parentId, subcategory: this.state.receivedCategory });
          bool = true;
        }
        subcats.push({ key: subCat.id, value: subCat.id, text: subCat.name });
      });
      if (bool || this.state.selectedCategory) {
        this.setState({ subCategoryOptions: subcats });
      }
    });
  }

  componentWillMount() {
    categoryService.getCategories().then(res => {
      let cats = [];

      res.data.map(cat => {
        cats.push({ key: cat.id, value: cat.id, text: cat.name });
        this.getSubCategories(cat.id);
      });
      this.setState({ categoryOptions: cats });
    });
    this.restetValues();
  }

  restetValues = () => {
    this.props.ticket
      ? this.setState({
          address: this.props.ticket.address,
          headline: this.props.ticket.title,
          details: this.props.ticket.description
        })
      : null;
    console.log(this.props.ticket);
  };

  render() {
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked={!this.props.borderless} basic={this.props.borderless}>
                <Form.Field>
                  <label>Addresse:</label>
                  <Input
                    fluid
                    icon="map"
                    iconPosition="left"
                    placeholder="Velg posisjon på kartet"
                    defaultValue={this.state.address}
                    readOnly
                  />
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
                    autoHeight
                    placeholder={'Beskrivelse'}
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
                        value={this.state.category}
                        options={this.state.categoryOptions}
                        placeholder="Kategori"
                        onChange={(event, data) => {
                          this.handleInput('category', data.value);
                          this.setState({ selectedCategory: true });
                          this.getSubCategories(data.value);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Underkategori</label>
                      <Dropdown
                        disabled={!this.state.category}
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

                <Form.Field>
                  <Label basic as={'label'}>
                    <Label as={'label'} basic htmlFor={'upload'}>
                      <Button
                        icon={'upload'}
                        label={{
                          basic: true,
                          content: 'Last opp bilde'
                        }}
                        labelPosition={'right'}
                      />

                      <input
                        hidden
                        id={'upload'}
                        type="file"
                        multiple
                        className={'ui button'}
                        //For multiple files(?) attr: multiple

                        onChange={(event, data) => {
                          console.log(event.target.files[0].name);

                          this.handleInput('image', event.target.files);
                        }}
                      />
                    </Label>
                    {this.state.image != null ? (
                      <Label
                        removeIcon={<Icon name={'delete'} />}
                        size={'large'}
                        onRemove={(event, data) => {
                          document.getElementById('upload').value = null;
                          this.setState({ image: null });
                          console.log(this.state);
                        }}
                        as={'a'}
                        content={this.state.image[0].name}
                      />
                    ) : null}
                  </Label>
                </Form.Field>

                <Form.Field>
                  <Checkbox
                    label={<label>Jeg ønsker å abonnere på saken</label>}
                    value={this.state.subscription}
                    onChange={(event, data) => {
                      if (data.checked) {
                        this.handleInput('subscription', 'true');
                      } else {
                        this.handleInput('subscription', 'false');
                      }
                    }}
                  />
                </Form.Field>
                {this.props.ticket ? (
                  <div>
                    <Button
                      color="blue"
                      fluid
                      size="large"
                      onClick={() =>
                        this.props.editTicket(
                          this.props.ticket.id,
                          this.state.headline,
                          this.state.details,
                          this.props.ticket.lat,
                          this.props.ticket.lon,
                          this.state.address,

                          this.state.subcategory ? this.state.subcategory : this.state.category,
                          this.props.ticket.municipalId,
                          this.state.subscription === 'true',
                          this.state.image,
                          this.props.ticket.status
                        )
                      }
                    >
                      Rediger
                    </Button>
                    <Button color="blue" fluid size="large" onClick={this.props.close}>
                      Avbryt
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={this.props.submit.bind(
                      this,
                      this.state.headline,
                      this.state.details,
                      this.state.latlng.lat,
                      this.state.latlng.lng,
                      this.state.address,

                      this.state.subcategory ? this.state.subcategory : this.state.category,
                      Cookies.get('municipalId'),
                      this.state.subscription === 'true',
                      this.state.image
                    )}
                  >
                    Send inn
                  </Button>
                )}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export class ModalTicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal open={this.props.showModalTicket}>
        <TicketFormWidget
          editTicket={this.props.editTicket}
          close={this.props.close}
          ticket={this.props.ticket}
          submitButton={'Lagre endringer'}
        />
      </Modal>
    );
  }
}
