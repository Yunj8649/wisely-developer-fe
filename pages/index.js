import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, List, Checkbox, Typography, Divider, Input, Radio, DatePicker } from 'antd';

const data = [
    {
        id: 1,
        isCompleted: true,
        contents: 'Racing car sprays burning fuel into crowd.',
        refIds: [ 1, 3 ],
        createdAt: moment().format('YYYY-MM-DD'),
        updatedAt: moment().format('YYYY-MM-DD'),
    },
    {
        id: 2,
        isCompleted: true,
        contents: 'Australian walks 100km after outback crash.',
        refIds: [],
        createdAt: moment().format('YYYY-MM-DD'),
        updatedAt: moment().format('YYYY-MM-DD'),
    },
    {
        id: 3,
        isCompleted: false,
        contents: 'Japanese princess to wed commoner.',
        refIds: [ 2 ],
        createdAt: moment().format('YYYY-MM-DD'),
        updatedAt: moment().format('YYYY-MM-DD'),
    },
    {
        id : 4,
        isCompleted: true,
        contents: 'Man charged over missing wedding girl.',
        refIds: [],
        createdAt: moment().format('YYYY-MM-DD'),
        updatedAt: moment().format('YYYY-MM-DD'),
    },
    {
        id: 5,
        isCompleted: false,
        contents: 'Los Angeles battles huge wildfires.',
        refIds: [],
        createdAt: moment().format('YYYY-MM-DD'),
        updatedAt: moment().format('YYYY-MM-DD'),
    },
  ];
export default function Home() {
    const [ searchContents, setSearchContents ] = useState('');
    const [ search, setSearch ] = useState({});

    const [ addContents, setAddContents ] = useState('');

    const [ editContentsId, setEditContentsId ] = useState( null );
    const [ editContentsValue, setEditContentsValue ] = useState('');

    const [ todoList, setTodoList ] = useState([]);
    const [ pagination, setPagination ] = useState({ page: 1, total: data.length, limit: 3 });

    const onClickAddContenets = useCallback( async () => {
        if ( _.isEmpty( addContents ) ) {
            alert('내용을 작성해주세요.')
            return;
        }
        const body = { contetns: addContents };
        console.log('add body : ', body)
        data.push({
            id: data.length + 1,
            isCompleted: false,
            contents: addContents,
            refIds: [],
            createdAt: moment(),
            updatedAt: moment(),
        })
        setAddContents('');
        // await addContents({ body });
        // 리스트 재조회
    }, [ addContents ]);
    
    // 완료 / 미완료
    const onClickCompleteCheck = useCallback(({ id, checked }) => {
        console.log('id : ',id)
        const index = _.findIndex(data, { id: id })
        console.log('index :' ,index)
        data[index]['isCompleted'] = checked;
        console.log(id, checked)
    }, []);
    
    // 내용 수정
    const onClickUpdateContents = useCallback(( todo ) => {
        const { id , contents, isCompleted } = todo;
        
        if ( isCompleted ) {
            alert('완료된 항목은 수정할 수 없습니다.');
            return;
        }
        setEditContentsId( id )
        setEditContentsValue( contents )
    }, []);

    const onClickEditContentsSave = useCallback(() => {
        const body = {
            id: editContentsId,
            contents: editContentsValue
        }

        setEditContentsId( null );
        setEditContentsValue( '' );
        // 저장 api
        // 리스트 재조회
    }, [ editContentsId, editContentsValue ])

    // 삭제
    const onClickDeleteContents = useCallback(({ id }) => {
        console.log(`${id} 삭제`)
    }, []);

    // 참조 추가/삭제

    const onSearchContents = useCallback(( value ) => {
        setSearch({ ...search, contetns: value });
    }, [ search ]);

    const onChangeCompletedRadio = useCallback((e) => {
        const { value } = e.target;
        setSearch({ ...search, isCompleted: value });
    }, [ search ]);

    const onChangeCreatedDate = useCallback(( dates ) => {
        setSearch({ 
            ...search,
            createdFrom: dates ? dates[0] : null,
            createdTo: dates ? dates[1] : null,
        });
    }, [ search ]);

    const onChangeUpdatedDate = useCallback(( dates ) => {
        setSearch({ 
            ...search,
            updatedFrom: dates ? dates[0] : null,
            updatedTo: dates ? dates[1] : null,
        });
    }, [ search ]);

    useEffect(() => {
        console.log(search)
    }, [ search ])

    return (
        <div className={styles.container}>
            <Head>
                <title>TODO</title>
                <meta name="description" content="wisely todo by yunj" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.filters}>
                    <Input.Search 
                        placeholder="내용 검색"
                        value={ searchContents }
                        onChange={ (e) => setSearchContents(e.target.value) }
                        onSearch={ onSearchContents }
                    />
                    <Radio.Group 
                        buttonStyle="solid"
                        defaultValue="ALL"
                        value={ search.isCompleted }
                        onChange={ onChangeCompletedRadio }
                    >
                        <Radio.Button value="ALL">전체</Radio.Button>
                        <Radio.Button value="COMPLETE">완료</Radio.Button>
                        <Radio.Button value="INCOMPLETE">미완료</Radio.Button>
                    </Radio.Group>
                    <Input.Group compact>
                        <Input disabled value="생성일" style={{ width: '15%' }}/>
                        <DatePicker.RangePicker 
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={ onChangeCreatedDate }
                        />
                    </Input.Group>
                    <Input.Group compact>
                        <Input disabled value="수정일" style={{ width: '15%' }}/>
                        <DatePicker.RangePicker 
                             ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={ onChangeUpdatedDate }
                        />
                    </Input.Group>
                </div>
                <List
                    style={{width: '80%'}}
                    header={
                        <Input.Group compact>
                            <Input 
                                style={{ width: 'calc(100% - 150px)' }} 
                                value={ addContents }
                                onChange={ e => setAddContents( e.target.value ) }
                            />
                            <Button 
                                type="primary"
                                onClick={ onClickAddContenets }
                            >추가</Button>
                        </Input.Group>
                    }
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                ((editContentsId === item.id) 
                                    ? <Button size="small" onClick={ onClickEditContentsSave }>저장</Button> 
                                    : <Button size="small" onClick={ () => onClickUpdateContents( item ) } disabled={ item.isCompleted }>수정</Button>),
                                <Button size="small">참조추가</Button>,
                                <Button size="small" onClick={ () => onClickDeleteContents({ id: item.id }) }>삭제</Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Checkbox 
                                        checked={item.isCompleted}
                                        onChange={ (e) => { onClickCompleteCheck({ id: item.id, checked: e.target.checked }) }}
                                    />
                                }
                                title={
                                    (editContentsId === item.id)
                                    ? <Input value={ editContentsValue } onChange={ e => setEditContentsValue( e.target.value )}/>
                                    : <Typography.Text delete={item.isCompleted}>{item.contents}</Typography.Text>
                                }
                                description={[
                                    <span>생성일 : {moment(item.createdAt).format('YYYY-MM-DD')}</span>,
                                    <Divider type="vertical" />,
                                    <span>마지막 수정일 : {moment(item.updatedAt).format('YYYY-MM-DD')}</span>,
                                    <Divider type="vertical" />,
                                    <span>참조 : {( item.refIds.length > 0 ) ? item.refIds.map(id => `@${id} `) : '없음'}</span>
                                ]}
                            />
                        </List.Item>
                    )}
                    pagination={{
                        size: 'small',
                        onChange: page => { setPagination({ ...pagination, page }) },
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                    }}
                    />
            </main>
        </div>
    )
}
