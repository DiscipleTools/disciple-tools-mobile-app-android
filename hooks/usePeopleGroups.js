import useRequest from 'hooks/useRequest';

const usePeopleGroups = (searchString) => {
  let url = 'dt/v1/people-groups/compact';
  if (searchString) url += `?s=${searchString}`;

  const { data, error, isLoading, isValidating } = useRequest(url);

  return {
    peopleGroups: data?.posts ?? null,
    error,
    isLoading,
    isValidating,
  };
};
export default usePeopleGroups;
