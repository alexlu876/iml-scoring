
def median(lst):
    x = len(lst)
    if x % 2 == 0:
        return (lst[x // 2] + lst[x // 2 + 1]) / 2
    return lst[x // 2 + 1]

def mean(lst):
    return sum(lst) / len(lst)


