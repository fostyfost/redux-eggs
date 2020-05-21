import { Task } from 'redux-saga'

export const allSagasDone = (sagaTasks: Task[]) => {
  return Promise.all(
    sagaTasks
      .map(task => task.toPromise())
      .map(task =>
        task
          .then(value => ({
            status: 'fulfilled',
            value,
          }))
          .catch(reason => ({
            status: 'rejected',
            reason,
          })),
      ),
  )
}
