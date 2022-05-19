import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, List, Checkbox, Typography, Divider, Input, Radio, DatePicker, message, Select, Tag } from 'antd';
import { addTodo, getTodos, deleteTodo, patchTodo } from './api/dataManager';

const DEFAULT_LIMIT = 5;
export default function Home( props ) {
    const { selectOptionsTodos } = props;

    const [ searchContents, setSearchContents ] = useState('');
    const [ search, setSearch ] = useState({});

    const [ addContents, setAddContents ] = useState('');

    const [ editContentsId, setEditContentsId ] = useState( null );
    const [ editContentsValue, setEditContentsValue ] = useState('');
    const [ editRefIds, setEditRefIds ] = useState([]);

    const [ isLoading, setIsLoading ] = useState( false );
    const [ todos, setTodos ] = useState( []);
    const [ pagination, setPagination ] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0 });

    const onClickAddContenets = useCallback( async ( e ) => {
        setIsLoading( true );
        e.preventDefault();
        if ( _.isEmpty( addContents ) ) {
            alert('내용을 작성해주세요.')
            setIsLoading( false );
            return;
        }
        const body = { 
            isCompleted: false,
            contents: addContents,
            refIds: [],
        };
        await addTodo({ body });
        setAddContents('');
        getTodoList();
        setIsLoading( false );
    }, [ addContents ]);
    
    const onClickCompleteCheck = useCallback( async ({ id, checked }) => {
        const body = {
            isCompleted: checked
        }
        try {
            await patchTodo({ id, body })
        } catch(e) {
            message.error('저장에 실패했습니다.')
        }
        getTodoList();
    }, [ search, pagination ]);
    
    const onClickEditTodo = useCallback(( todo ) => {
        const { id , contents, isCompleted, refIds } = todo;
        
        if ( isCompleted ) {
            alert('완료된 항목은 수정할 수 없습니다.');
            return;
        }
        setEditContentsId( id )
        setEditContentsValue( contents )
        setEditRefIds( refIds )
    }, []);
    const onClickEditContentsSave = useCallback( async () => {
        const body = {
            contents: editContentsValue,
            refIds: editRefIds
        }
        await patchTodo({ id: editContentsId, body })
            
        setEditContentsId( null );
        setEditContentsValue( '' );
        setEditRefIds([]);
        getTodoList();
    }, [ editContentsId, editContentsValue, editRefIds, search, pagination ])

    const onClickDeleteTodo = useCallback( async ({ id }) => {
        try {
            await deleteTodo({ id });
            getTodoList()
        } catch (e) {
            message.error('삭제에 실패했습니다.')
        }
    }, [ search, pagination ]);

    const getTodoList = useCallback( async() => {
        try {
            setIsLoading( true )
            const query = {
                page: pagination.page,
                limit: DEFAULT_LIMIT
            };

            const { 
                contents = '',
                createdFrom, createdTo,
                updatedFrom, updatedTo,
                isCompleted
            } = search;

            if ( !_.isEmpty(contents) ) {
                query.contents = contents;
            }

            if (createdFrom && createdTo) {
                query.createdFrom = moment(createdFrom).format('YYYY-MM-DD');
                query.createdTo = moment(createdTo).format('YYYY-MM-DD');
            }
    
            if (updatedFrom && updatedTo) {
                query.updatedFrom = moment(updatedFrom).format('YYYY-MM-DD');
                query.updatedTo = moment(updatedTo).format('YYYY-MM-DD');
            }
    
            if ( !_.isEmpty(isCompleted) && isCompleted !== 'ALL' ) {
                query.isCompleted = (isCompleted === 'COMPLETE');
            }
            const response = await getTodos({ query });
            setTodos( response.data );
            setPagination({ ...pagination, total: response.pagination.total})
        } catch {
            message.error('조회에 실패했습니다.')
        } finally {
            setIsLoading( false )
        }
    }, [ search, pagination ]);
   
    const onSearchContents = useCallback(( value ) => {
        setSearch({ ...search, contents: value });
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
        getTodoList()
    }, [ search, pagination.page ])

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
                        className={styles.searchContentsInput}
                        placeholder="내용 검색"
                        value={ searchContents }
                        onChange={ (e) => setSearchContents(e .target.value) }
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
                    <br/>
                    <Input.Group compact className={ styles.searchDateGroup }>
                        <Input disabled value="생성일" className={styles.searchText}/>
                        <DatePicker.RangePicker 
                            className={styles.searchDate}
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={ onChangeCreatedDate }
                        />
                    </Input.Group>
                    <Input.Group compact className={ styles.searchDateGroup }>
                        <Input disabled value="수정일" className={styles.searchText}/>
                        <DatePicker.RangePicker 
                            className={styles.searchDate}
                            ranges={{
                                Today: [moment(), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={ onChangeUpdatedDate }
                        />
                    </Input.Group>
                </div>
                <List
                    loading={ isLoading }
                    style={{width: '80%'}}
                    header={
                        <Input.Group compact>
                            <Input 
                                style={{ width: 'calc(100% - 150px)' }} 
                                value={ addContents }
                                onChange={ e => setAddContents( e.target.value ) }
                                onPressEnter={ e => onClickAddContenets( e ) }
                            />
                            <Button 
                                type="primary"
                                disabled={ isLoading }
                                onClick={ e => onClickAddContenets( e ) }
                            >추가</Button>
                        </Input.Group>
                    }
                    bordered
                    dataSource={ todos }
                    renderItem={item => (
                        <List.Item
                            actions={[
                                ((editContentsId === item.id) 
                                    ? <Button size="small" onClick={ onClickEditContentsSave }>저장</Button> 
                                    : <Button size="small" onClick={ () => onClickEditTodo( item ) } disabled={ item.isCompleted }>수정</Button>),
                                <Button size="small" onClick={ () => onClickDeleteTodo({ id: item.id }) }>삭제</Button>,
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
                                    <span>id : {item.id}</span>,
                                    <Divider type="vertical" />,
                                    <span>생성일 : {moment(item.createdAt).format('YYYY-MM-DD')}</span>,
                                    <Divider type="vertical" />,
                                    <span>마지막 수정일 : {moment(item.updatedAt).format('YYYY-MM-DD')}</span>,
                                    <Divider type="vertical" />,
                                    ((editContentsId === item.id) 
                                        ? <Select 
                                            mode="tags" 
                                            style={{ width: '60%' }} 
                                            placeholder="참조 todo 선택"
                                            optionFilterProp='name'
                                            value={ editRefIds } 
                                            onChange={ (value) => setEditRefIds(value)}
                                        >
                                            {_.map(selectOptionsTodos, item => (<Select.Option key={item.id} value={item.id} name={`${item.id}${item.contents}`}>{`[${item.id}] ${item.contents}`}</Select.Option>))}
                                        </Select>
                                        : <span>참조 : {( item.refIds.length > 0 ) ? item.refIds.map(id => (<Tag>{`@${id}`}</Tag>)) : '없음'}</span>
                                        )
                                ]}
                            />
                        </List.Item>
                    )}
                    pagination={{
                        size: 'small',
                        onChange: page => setPagination({ ...pagination, page }),
                        current: pagination.page,
                        pageSize: pagination.limit,
                        total: pagination.total,
                    }}
                    />
            </main>
        </div>
    )
}

export async function getServerSideProps( context ) {
    const query = { page: 1, limit: 100 }
    const response = await getTodos({ query });
    const { data, pagination } = response;
  
    return {
        props: {
            selectOptionsTodos: data,
        }
    }
}