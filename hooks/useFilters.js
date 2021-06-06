import usePostType from 'hooks/usePostType';
import useRequest from 'hooks/useRequest';

const useFilters = () => {
  const { postType } = usePostType();

  const url = `/dt/v1/users/get_filters?post_type=${postType}&force_refresh=1`;

  const { data, error, isLoading, isValidating } = useRequest(url);

  const mapCustomFiltersByTab = (customFilters, tab) => {
    const mappedCustomFilters = [];
    customFilters?.filters.forEach((filter) => {
      if (filter?.tab === tab) {
        const ID = filter?.ID ?? null;
        const name = filter?.name ?? '';
        const count = filter?.count ?? 0;
        const subfilter = filter?.subfilter ?? false;
        const query = filter?.query ?? {};
        mappedCustomFilters.push({
          ID,
          name,
          count,
          subfilter,
          query,
        });
      }
    });
    return mappedCustomFilters;
  };

  const mapCustomFilters = (customFilters) => {
    const mappedCustomFilters = [];
    customFilters?.tabs.forEach((tab) => {
      const key = tab?.key ?? null;
      const title = tab?.label ?? '';
      let content = [];
      if (title) content = mapCustomFiltersByTab(customFilters, key);
      mappedCustomFilters.push({
        title,
        count: 0,
        content,
      });
    });
    return mappedCustomFilters;
  };
  const customFilters = data?.filters?.length > 0 ? mapCustomFilters(data) : null;
  return {
    customFilters,
    error,
    isLoading,
    isValidating,
  };
};
export default useFilters;
