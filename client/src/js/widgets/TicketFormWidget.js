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
  Image,
  Input,
  Label,
  Modal,
  Segment,
  TextArea,
  Divider
} from 'semantic-ui-react';

import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

import Cookies from 'js-cookie';

export class TicketFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address ? this.props.address : '',
      latlng: this.props.latlng ? this.props.latlng : [null, null],
      subregion: this.props.subregion ? this.props.subregion : '',
      title: this.props.ticket ? this.props.ticket.title : '',
      description: this.props.ticket ? this.props.ticket.description : '',
      category: '',
      allCats: [],
      categoryOptions: [],
      receivedCategory: this.props.ticket ? this.props.ticket.categoryId : '',
      subCategory: '',
      subCategoryOptions: [],
      position: [null, null],
      subscribed: this.props.ticket ? this.props.ticket.subscribed : true,
      selectedCategory: false,
      modalMessage: '',
      modalOpen: false,
      image: this.props.ticket ? this.props.ticket.uploads : [],
      imageUploaded: false
    };
  }
  close = () => this.setState({ modalOpen: false });

  componentDidUpdate(prevProps) {
    if (prevProps != this.props) {
      this.setState({ address: this.props.address, latlng: this.props.latlng, subregion: this.props.subregion });
    }
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  getSubCategories(category) {
    let subCats = [];
    let subCatsOpt = [];

    this.state.allCats.map(cat => {
      if (cat.id === category) {
        subCats = cat.subs;
      }
    });
    subCats.map(subCat => {
      subCatsOpt.push({ key: subCat.id, value: subCat.id, text: subCat.name });
    });
    this.setState({ subCategoryOptions: subCatsOpt });
    this.state.receivedCategory === -1 ? this.setState({ subCategory: subCats[0].id }) : null;
  }

  componentWillMount() {
    let parentId = -1;
    let cats = [];
    categoryService
      .getCategories()
      .then(res => {
        this.setState({ allCats: res.data });

        res.data.map(cat => {
          cats.push({ key: cat.id, value: cat.id, text: cat.name });
          if (this.props.ticket) {
            cat.subs.map(subCat => {
              if (subCat.id === this.state.receivedCategory) {
                parentId = subCat.parentId;
                this.getSubCategories(parentId);
              }
            });
          }
        });
      })
      .then(() => {
        !this.props.ticket ? this.setState({ categoryOptions: cats, receivedCategory: -1 }) : null;

        this.props.ticket
          ? this.setState(
              {
                address: this.props.ticket.address,
                subCategory: this.state.receivedCategory,
                category: parentId
              },
              () => {
                this.setState({ categoryOptions: cats, receivedCategory: -1 });
              }
            )
          : null;
      });
  }

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
                    onClick={
                      this.props.setupClick
                        ? () => this.props.setupClick(this.state.address)
                        : this.props.editTicket
                        ? () =>
                            toast.info(
                              'Endring av posisjon er foreløpig ikke mulig, registrer saken på nytt om det haster',
                              { autoClose: 5000 }
                            )
                        : () => toast.info('Gå tilbake for å endre posisjon')
                    }
                  />
                </Form.Field>
                <Divider hidden />
                <Form.Field>
                  <label>Hva vil du melde inn?</label>
                  <Input
                    fluid
                    icon="warning"
                    iconPosition="left"
                    placeholder={'Hva er problemet?'}
                    value={this.state.title}
                    onChange={(event, data) => {
                      this.handleInput('title', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Utdyp problemet</label>
                  <TextArea
                    autoHeight
                    placeholder={'Beskrivelse'}
                    value={this.state.description}
                    onChange={(event, data) => {
                      this.handleInput('description', data.value);
                    }}
                  />
                </Form.Field>
                <Divider hidden />
                <Form.Field>
                  <Grid columns={'equal'}>
                    <Grid.Column>
                      <Form.Field>
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
                            this.setState({ selectedCategory: true }, () => {
                              this.getSubCategories(data.value);
                            });
                          }}
                        />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column>
                      <Form.Field>
                        <label>Underkategori</label>
                        <Dropdown
                          disabled={!this.state.category}
                          fluid
                          search
                          selection
                          options={this.state.subCategoryOptions}
                          placeholder={'Underkategori'}
                          value={this.state.subCategory}
                          onChange={(event, data) => {
                            this.handleInput('subCategory', data.value);
                          }}
                        />
                      </Form.Field>
                    </Grid.Column>
                  </Grid>
                </Form.Field>
                <Divider hidden />
                <Form.Field>
                  {!this.props.ticket ? (
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
                        onChange={(event, data) => {
                          let images = this.state.image;

                          for (let i = 0; i < event.target.files.length; i++) {
                            event.target.files.name = event.target.files.filename;
                            images.push(event.target.files[i]);
                          }

                          this.setState({ image: images }, () => {
                            this.setState({ imageUploaded: true });
                          });
                        }}
                      />
                    </Label>
                  ) : null}
                  {this.state.image.length > 0
                    ? this.state.image.map((image, i) =>
                        this.props.ticket ? (
                          <Modal
                            basic
                            dimmer={'blurring'}
                            size={'large'}
                            key={i}
                            trigger={
                              <Label
                                key={i}
                                id={i}
                                as={'a'}
                                removeIcon={<Icon name={'delete'} />}
                                size={'large'}
                                content={image.name || image.filename}
                              />
                            }
                          >
                            <Modal.Content image>
                              <Image wrapped src={'http://localhost:3000/uploads/' + image.filename} />
                            </Modal.Content>
                          </Modal>
                        ) : (
                          <Label
                            key={i}
                            id={i}
                            as={'a'}
                            removeIcon={<Icon name={'delete'} />}
                            size={'large'}
                            onRemove={(event, data) => {
                              let newImages = [];
                              this.state.image.map((img, i) => {
                                if (i !== data.id) {
                                  newImages.push(img);
                                }
                              });
                              document.getElementById('upload').value = '';
                              this.setState({ image: newImages }, () => {});
                            }}
                            content={image.name || image.filename}
                          />
                        )
                      )
                    : null}
                </Form.Field>

                <Form.Field>
                  <Checkbox
                    label={<label>Jeg ønsker å abonnere på saken</label>}
                    checked={this.state.subscribed}
                    onChange={(event, data) => {
                      this.handleInput('subscribed', data.checked);
                    }}
                  />
                </Form.Field>
                {this.props.ticket ? (
                  <div>
                    <Button
                      color="blue"
                      fluid
                      size="large"
                      onClick={() => {
                        this.props.editTicket(
                          this.props.ticket.id,
                          this.state.title,
                          this.state.description,
                          this.props.ticket.lat,
                          this.props.ticket.lon,
                          this.state.address,

                          this.state.subCategory,
                          this.props.ticket.municipalId,
                          this.state.subscribed,
                          this.state.image,
                          this.props.ticket.status
                        );
                      }}
                    >
                      Lagre endringer
                    </Button>
                    <Button color="grey" fluid size="large" onClick={this.props.close}>
                      Avbryt
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() => {
                      this.props.submit(
                        this.state.title,
                        this.state.description,
                        this.state.latlng.lat,
                        this.state.latlng.lng,
                        this.state.address,

                        this.state.subCategory ? this.state.subCategory : this.state.category,
                        this.state.subscribed,
                        this.state.image,
                        this.state.subregion
                      );
                    }}
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
      <Modal open={this.props.open} onClose={this.props.close} closeIcon>
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
