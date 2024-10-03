import { useEffect, useMemo, useState } from 'react';
import { useServerRequest } from '../../hooks';
import { Pagination, PostCard, Search } from './components';
import styled from 'styled-components';
import { PAGINATION_LIMIT } from '../../constans';
import { debounce, getLastPageFromLinks } from './utils';

const MainContainer = ({ className }) => {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [shuoldSearch, setShuoldSearch] = useState(false);
	const [searchPhrase, setSearchPhrase] = useState('');
	const requestServer = useServerRequest();

	useEffect(() => {
		requestServer('fetchPosts', searchPhrase, page, PAGINATION_LIMIT).then(
			({ res: { posts, links } }) => {
				setPosts(posts);
				setLastPage(getLastPageFromLinks(links));
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [requestServer, page, shuoldSearch]);

	const startDelayedSearch = useMemo(() => debounce(setShuoldSearch, 2000), []);

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		startDelayedSearch(!shuoldSearch);
	};

	return (
		<div className={className}>
			<Search onChange={onSearch} searchPhrase={searchPhrase} />
			{posts.length ? (
				<div className="post-list">
					{posts.map(({ id, title, publishedAt, imageUrl, commentsCount }) => (
						<PostCard
							key={id}
							id={id}
							title={title}
							publishedAt={publishedAt}
							imageUrl={imageUrl}
							commentsCount={commentsCount}
						/>
					))}
				</div>
			) : (
				<div className="no-posts-found">Статьи не найдены</div>
			)}

			{lastPage > 1 && (
				<Pagination page={page} lastPage={lastPage} setPage={setPage} />
			)}
		</div>
	);
};

export const Main = styled(MainContainer)`
	& .post-list {
		padding: 20px 20px 80px;
		display: flex;
		flex-wrap: wrap;
	}

	& .no-posts-found {
		margin-top: 40px;
		text-align: center;
		font-size: 18px;
	}
`;
